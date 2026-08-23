#!/usr/bin/env node
/**
 * Creates ONE fully worked-out example post — "Glacier Dialogue 6: Glaciers,
 * Biodiversity and Life" (slug GD7) — in WordPress, using the new Gutenberg
 * blocks. This is the single richest existing article (10 embedded photos,
 * 4 speakers, 3 quotes, a stats banner, an insight card, and a 7-item
 * takeaways list), so it doubles as a real demonstration of every block type
 * plus the base64-photo -> Media Library migration this project exists to do.
 *
 * The 10 content photos + 4 speaker portraits are extracted straight out of
 * the base64 data already embedded in src/data/dialogues.js, decoded, and
 * uploaded as real Media Library files — replacing ~2MB of inline base64
 * with normal WordPress attachments.
 *
 * Usage:
 *   WORDPRESS_SITE_URL=http://tvgf.local \
 *   WORDPRESS_PREVIEW_APP_USER=chintu \
 *   WORDPRESS_PREVIEW_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx" \
 *   node scripts/create-gd7-example.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { podcasts } from "../src/data/podcasts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIALOGUES_FILE = path.join(__dirname, "../src/data/dialogues.js");

const SITE_URL = process.env.WORDPRESS_SITE_URL;
const USER = process.env.WORDPRESS_PREVIEW_APP_USER;
const PASSWORD = process.env.WORDPRESS_PREVIEW_APP_PASSWORD;

if (!SITE_URL || !USER || !PASSWORD) {
  console.error(
    "Missing WORDPRESS_SITE_URL / WORDPRESS_PREVIEW_APP_USER / WORDPRESS_PREVIEW_APP_PASSWORD env vars.\n" +
      "PASSWORD must be a WordPress Application Password (Users > Profile > Application Passwords) — never your real login password."
  );
  process.exit(1);
}

const authHeader = "Basic " + Buffer.from(`${USER}:${PASSWORD}`).toString("base64");

// ---------------------------------------------------------------------------
// 1. Extract every base64 <img> in the GD7 entry from the raw source file,
//    keyed by its alt text (unique per photo in this article).
// ---------------------------------------------------------------------------

function extractBase64ImagesForSlug(slug) {
  const raw = fs.readFileSync(DIALOGUES_FILE, "utf8");
  const entryStart = raw.indexOf(`slug: "${slug}"`);
  if (entryStart === -1) throw new Error(`Could not find slug "${slug}" in dialogues.js`);
  const nextEntry = raw.indexOf('slug: "', entryStart + 10);
  const entryText = raw.slice(entryStart, nextEntry === -1 ? undefined : nextEntry);

  const images = new Map();
  const imgRegex = /<img\s+src="(data:image\/[a-zA-Z]+;base64,[^"]+)"\s+alt="([^"]*)"/g;
  let match;
  while ((match = imgRegex.exec(entryText))) {
    const [, dataUri, alt] = match;
    if (!images.has(alt)) images.set(alt, dataUri);
  }
  return images;
}

async function findExistingMedia(filename) {
  const res = await fetch(
    `${SITE_URL}/wp-json/wp/v2/media?search=${encodeURIComponent(filename)}&per_page=5`,
    { headers: { Authorization: authHeader } }
  );
  if (!res.ok) return null;
  const items = await res.json();
  const match = items.find((m) => m.slug === filename || m.slug?.startsWith(filename));
  return match ? match.source_url : null;
}

async function uploadBase64Image(dataUri, filename, altText) {
  // Re-running this script (e.g. after a content-only fix) shouldn't create
  // duplicate Media Library entries for images already uploaded.
  const existing = await findExistingMedia(filename);
  if (existing) {
    return existing;
  }

  const [, mime, b64] = dataUri.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  const buffer = Buffer.from(b64, "base64");
  const ext = mime.split("/")[1];

  const res = await fetch(`${SITE_URL}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="${filename}.${ext}"`,
    },
    body: buffer,
  });

  if (!res.ok) {
    throw new Error(`Media upload failed for "${filename}": ${res.status} ${await res.text()}`);
  }

  const media = await res.json();

  // Set alt text on the attachment.
  await fetch(`${SITE_URL}/wp-json/wp/v2/media/${media.id}`, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ alt_text: altText }),
  });

  return media.source_url;
}

// ---------------------------------------------------------------------------
// 2. Gutenberg block markup generators (mirroring each block's save() output)
// ---------------------------------------------------------------------------

const esc = (s) => String(s ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function paragraph(html) {
  return `<!-- wp:paragraph -->\n<p>${html}</p>\n<!-- /wp:paragraph -->`;
}

function heading(text, level = 2) {
  return `<!-- wp:heading {"level":${level}} -->\n<h${level}>${esc(text)}</h${level}>\n<!-- /wp:heading -->`;
}

function kicker(text) {
  return `<!-- wp:paragraph {"className":"tvgf-kicker"} -->\n<p class="tvgf-kicker"><strong>${esc(
    text
  ).toUpperCase()}</strong></p>\n<!-- /wp:paragraph -->`;
}

function quote(text, citation) {
  return `<!-- wp:quote -->\n<blockquote class="wp-block-quote"><p>${text}</p><cite>${esc(
    citation
  )}</cite></blockquote>\n<!-- /wp:quote -->`;
}

function image(url, alt, caption) {
  const img = `<img src="${url}" alt="${esc(alt)}"/>`;
  if (!caption) {
    return `<!-- wp:image -->\n<figure class="wp-block-image">${img}</figure>\n<!-- /wp:image -->`;
  }
  return `<!-- wp:image -->\n<figure class="wp-block-image">${img}<figcaption>${caption}</figcaption></figure>\n<!-- /wp:image -->`;
}

function contextStrip(items) {
  const json = JSON.stringify({ items });
  const html = items
    .map(
      (i) =>
        `<div class="tvgf-context-item"><span class="tvgf-context-icon">${i.icon}</span><div><div class="tvgf-context-label">${esc(
          i.label
        )}</div><div class="tvgf-context-value">${esc(i.value)}</div></div></div>`
    )
    .join("");
  return `<!-- wp:tvgf/context-strip ${json} -->\n<div class="wp-block-tvgf-context-strip tvgf-context-strip">${html}</div>\n<!-- /wp:tvgf/context-strip -->`;
}

function statTiles(tiles) {
  const json = JSON.stringify({ tiles });
  const html = tiles
    .map(
      (t) =>
        `<div class="tvgf-stat-tile"><div class="tvgf-stat-value">${esc(
          t.value
        )}</div><div class="tvgf-stat-label">${esc(t.label)}</div></div>`
    )
    .join("");
  return `<!-- wp:tvgf/stat-tiles ${json} -->\n<div class="wp-block-tvgf-stat-tiles tvgf-stat-tiles">${html}</div>\n<!-- /wp:tvgf/stat-tiles -->`;
}

function speakerBio({ name, role, org, bio, photoUrl, photoAlt }) {
  const attrs = { name, role, org, bio, photoUrl: photoUrl || "", photoAlt: photoAlt || "" };
  const photoHtml = photoUrl ? `<img class="tvgf-speaker-photo" src="${photoUrl}" alt="${esc(photoAlt)}"/>` : "";
  const html = `<div class="wp-block-tvgf-speaker-bio tvgf-speaker-bio">${photoHtml}<div class="tvgf-speaker-info"><div class="tvgf-speaker-name">${esc(
    name
  )}</div><div class="tvgf-speaker-role">${esc([role, org].filter(Boolean).join(", "))}</div>${
    bio ? `<p class="tvgf-speaker-bio-text">${esc(bio)}</p>` : ""
  }</div></div>`;
  return `<!-- wp:tvgf/speaker-bio ${JSON.stringify(attrs)} -->\n${html}\n<!-- /wp:tvgf/speaker-bio -->`;
}

function callout({ variant, title, body }) {
  const attrs = { variant, title: title || "", body };
  const html = `<div class="wp-block-tvgf-callout tvgf-callout tvgf-callout-${variant}">${
    title ? `<div class="tvgf-callout-title">${esc(title)}</div>` : ""
  }<p class="tvgf-callout-body">${esc(body)}</p></div>`;
  return `<!-- wp:tvgf/callout ${JSON.stringify(attrs)} -->\n${html}\n<!-- /wp:tvgf/callout -->`;
}

function orderedList(items) {
  const lis = items.map((i) => `<li>${i}</li>`).join("");
  return `<!-- wp:list {"ordered":true} -->\n<ol class="wp-block-list">${lis}</ol>\n<!-- /wp:list -->`;
}

// ---------------------------------------------------------------------------
// 3. GD7 content, transcribed from src/data/dialogues.js
// ---------------------------------------------------------------------------

async function buildContent(images, upload) {
  const photo = async (alt, credit) => {
    const dataUri = images.get(alt);
    if (!dataUri) {
      console.warn(`  ! No base64 image found for alt="${alt}" — skipping.`);
      return "";
    }
    const url = await upload(dataUri, alt.slice(0, 40).replace(/[^a-z0-9]+/gi, "-").toLowerCase(), alt);
    return image(url, alt, credit);
  };

  const speakerPhoto = async (alt) => {
    const dataUri = images.get(alt);
    if (!dataUri) return "";
    return upload(dataUri, alt.replace(/[^a-z0-9]+/gi, "-").toLowerCase(), alt);
  };

  const parts = [];

  parts.push(
    contextStrip([
      { icon: "📅", label: "Date", value: "23 May 2026 · Day after World Biodiversity Day" },
      { icon: "🌐", label: "Format", value: "Online Dialogue · Glacier Dialogues Series" },
      { icon: "🎯", label: "Session Theme", value: "Glaciers, Biodiversity & Life" },
    ])
  );

  parts.push(
    statTiles([
      { value: "64,000", label: "glaciers in the HKH region — 20% of glacial area lost in the 30 years to 2020" },
      { value: "2 billion+", label: "people downstream depending on glacier-fed rivers, 29% of the global population" },
      { value: "15–20 pairs", label: "of black-necked cranes breeding in India — each pair irreplaceable" },
    ])
  );

  parts.push(
    quote(
      "Even a half-degree to one-degree temperature change can have disastrous consequences for wildlife in high-altitude ecosystems. These are not abstract projections. We have watched them unfold.",
      "— Dr. Yash Veer Bhatnagar, Country Representative, IUCN India · Glacier Dialogues, Session 6"
    )
  );

  parts.push(kicker("The Panel"));
  parts.push(
    speakerBio({
      name: "Dr. Yash Veer Bhatnagar",
      role: "Country Representative",
      org: "International Union for Conservation of Nature (IUCN) India",
      bio: "Over three decades of research on Himalayan wildlife, snow leopard conservation, and human-wildlife coexistence.",
      photoUrl: await speakerPhoto("Dr. Yash Veer Bhatnagar"),
      photoAlt: "Dr. Yash Veer Bhatnagar",
    })
  );
  parts.push(
    speakerBio({
      name: "Dr. Pankaj Chandan",
      role: "Country Lead, Black-necked Crane India Project",
      org: "International Crane Foundation & IUCN Species Survival Commission (SSC)",
      bio: "Nearly 20 years of field documentation of crane breeding and migration across Ladakh and Bhutan.",
      photoUrl: await speakerPhoto("Dr. Pankaj Chandan"),
      photoAlt: "Dr. Pankaj Chandan",
    })
  );
  parts.push(
    speakerBio({
      name: "Archana Chatterjee",
      role: "Programme Manager",
      org: "International Union for Conservation of Nature (IUCN) India Office",
      bio: "28 years across international NGOs and UN agencies, expertise in wetland management and transboundary water governance.",
      photoUrl: await speakerPhoto("Archana Chatterjee"),
      photoAlt: "Archana Chatterjee",
    })
  );
  parts.push(
    speakerBio({
      name: "Anurag Maloo",
      role: "Convener & Moderator, Founder & CEO",
      org: "The Voice of Glaciers Foundation",
      bio: "",
      photoUrl: await speakerPhoto("Anurag Maloo"),
      photoAlt: "Anurag Maloo",
    })
  );

  parts.push(
    paragraph(
      "On 23 May 2026, the day following World Biodiversity Day, The Voice of Glaciers Foundation (TVGF) convened the sixth session of its Glacier Dialogues series under the theme <em>Glaciers, Biodiversity and Life</em>. Where previous sessions addressed glacier science, disaster risk, community adaptation, storytelling, and climate migration, this session turned to a question that remains largely invisible in mainstream climate discourse: what happens to life itself when the ice disappears?"
    )
  );
  parts.push(
    paragraph(
      "The Hindu Kush Himalayan (HKH) region, home to over 63,700 glaciers and recognised as one of the most biodiverse mountain ecosystems on Earth, sustains alpine wetlands, glacier-fed streams, high-altitude meadows, snow leopards, black-necked cranes, bar-headed geese, brown bears, kiang, and the agro-pastoral communities who have lived alongside them for centuries. As glaciers shrink, these systems do not merely change. They begin, in ways both dramatic and quiet, to unravel."
    )
  );
  parts.push(
    await photo(
      "Tso Moriri, Ladakh, at approximately 4,500 metres above sea level",
      "Dr. Pankaj Chandan · Black-necked Crane & Climate Change: Field Perspectives from Himalayan Landscapes · Used with permission"
    )
  );

  parts.push(kicker("Lived Experience, Changing Land"));
  parts.push(heading("Three Decades of Watching the Himalaya Transform"));
  parts.push(
    paragraph(
      "Dr. Yash Veer Bhatnagar opened with something disarmingly simple: not a dataset, but a view. Over 30 years of field research across the HKH landscape, he has watched the white recede, and with it, the conditions that structured both wildlife and human life at altitude."
    )
  );
  parts.push(
    paragraph(
      "Mountain communities are agro-pastoral by necessity. Many families practise transhumance, traversing over 200 kilometres each year with livestock between seasonal pastures. The changes now reshaping those patterns are not uniform. They compound each other: altered water availability, shifting snowlines, warming-enabled vegetation advance, and new cultivation possibilities arriving together as a disrupted system rather than a manageable set of individual changes."
    )
  );
  parts.push(
    await photo(
      "Transhumance in a high-altitude river gorge — a herder moving a mixed flock along a glacial stream",
      "Dr. Yash Veer Bhatnagar · Glaciers and Life · Used with permission"
    )
  );
  parts.push(
    paragraph(
      "Dr. Yash Veer Bhatnagar described the Changthang Plateau above 4,200 metres — territory where barley simply refused to ripen 30 years ago. It ripens now. The consequence is an escalation of crop-damage conflict with kiang, the hardy wild equid of the Tibetan Plateau, who have always coexisted with nomadic herders around traditional forage but now encounter fences and fields on territory they have grazed for millennia."
    )
  );
  parts.push(
    await photo(
      "Kiang (Tibetan wild ass) on the Changthang Plateau, eastern Ladakh",
      "Dr. Yash Veer Bhatnagar · Glaciers and Life · Used with permission"
    )
  );
  parts.push(
    paragraph(
      "In Lahaul, at around 3,000 metres, apple orchards have taken root where only potato and barley once grew. This carries genuine complexity: warming-enabled agriculture is also enabling people to remain in ancestral homes through winter rather than migrating to lower valleys — offering economic stability to a region whose population had been declining. The same warming that fragments ecosystems also creates livelihoods. The challenge lies in building institutional frameworks that allow both to coexist."
    )
  );
  parts.push(
    await photo(
      "Iceberg lettuce harvest at high altitude in Lahaul — new cash crops at once an opportunity and an ecological signal",
      "Dr. Yash Veer Bhatnagar · Glaciers and Life · Used with permission"
    )
  );
  parts.push(
    paragraph(
      "Apple orchards in Lahaul attract brown bears — drawn by fruit from May through late autumn. Bears now linger in proximity to villages through seasons they previously vacated. In the Dras area of Kargil, brown bears are no longer hibernating through winter as they should. Year-round activity has disrupted the physiology of the species and the working rhythm of communities built around winter's quietude."
    )
  );
  parts.push(
    await photo(
      "Brown bears in the scrub zone of Lahaul-Spiti — a species whose hibernation patterns are being disrupted by warming",
      "Shiv Kumar, HPFD / Dr. Yash Veer Bhatnagar · Glaciers and Life · Used with permission"
    )
  );
  parts.push(
    quote(
      "Any land vacated by a retreating glacier will not be inhabitable for centuries. Ecological succession is not a solution. It is a timeline that operates on geological patience.",
      "— Dr. Yash Veer Bhatnagar, Country Representative, IUCN India"
    )
  );
  parts.push(
    paragraph(
      "A persistent misconception holds that glacier retreat creates new habitat. When ice withdraws, it exposes bare moraine: unstable rock with no soil, no organic matter, no moisture-holding capacity. Succession proceeds from lichens and mosses through cushion plants, invertebrates, small mammals, and eventually larger species — a process measured in centuries. No species of ecological consequence benefits in any humanly relevant timeframe. Meanwhile, subalpine forest edges are advancing upward, compressing the alpine meadow from below even as retreating ice compresses it from above."
    )
  );
  parts.push(
    paragraph(
      "Beyond visible glaciers, permafrost — frozen earth below the surface — is a compounding factor that receives far less attention. It is the structural substrate of high-altitude landscapes; when it thaws, entire slopes become unstable and prone to erosion. There is also a localised driver of glacier melt that is often overlooked: black carbon. Particulate matter from diesel vehicle emissions, brick kilns, and traditional cooking stoves settles on glacier surfaces, reducing their albedo and causing them to absorb more solar radiation and melt faster. The International Union for Conservation of Nature (IUCN) has a resolution on this from its World Conservation Congress."
    )
  );
  parts.push(
    await photo(
      "Changthangi goats on transhumance in Ladakh, with glaciated peaks in the distance",
      "Dr. Yash Veer Bhatnagar · Glaciers and Life · Used with permission"
    )
  );

  parts.push(kicker("A Bird That Lives Only on Glaciers"));
  parts.push(heading("The Black-Necked Crane: Eighteen Years, One Mound"));
  parts.push(
    paragraph(
      'Dr. Pankaj Chandan has spent nearly 20 years following a bird that most people have never heard of. The black-necked crane — the last of the 15 crane species to be formally described to science, and the only one that lives and breeds exclusively at high altitude — nests in glacier-fed wetlands at 4,000 to 5,000 metres above sea level across the Tibetan Plateau. India hosts just 15 to 20 breeding pairs. Dr. Pankaj Chandan calls them, without sentimentality, "birds of glaciers." Their existence is contingent on the ice.'
    )
  );
  parts.push(
    paragraph(
      "The loss of the Siberian crane from its historical Indian wintering grounds at Bharatpur in Rajasthan serves as a sobering precedent. India was once a Siberian crane wintering nation. It no longer is. The black-necked crane's presence in India — with 15 to 20 breeding pairs — is fragile in ways that its advocates cannot afford to understate."
    )
  );
  parts.push(
    paragraph(
      "The story of a single tagged bird captures this fragility better than any statistic. In 1995, an Indian Army officer placed a green identification tag on a black-necked crane in the high-altitude wetlands of Ladakh — the first crane to be tagged in India. That bird returned to the same small area of nesting marsh — the same cluster of tussock mounds on the same glacier-fed wetland — for <strong>18 consecutive years</strong>."
    )
  );
  parts.push(kicker("The Tagged Pair — Documented Across Seasons"));
  parts.push(
    await photo(
      "Black-necked crane pair — one with green tag — feeding at glacier-fed wetland tussocks",
      "Dr. Pankaj Chandan · Black-necked Crane & Climate Change · Used with permission"
    )
  );
  parts.push(
    await photo(
      "Tagged black-necked crane parent with chicks at nesting mound",
      "Dr. Pankaj Chandan · Black-necked Crane & Climate Change · Used with permission"
    )
  );
  parts.push(
    quote(
      "One pair, one mound, 18 years. That is what site fidelity means for a species with so few breeding individuals. Lose the mound and you lose the pair.",
      "— Dr. Pankaj Chandan, Country Lead, Black-necked Crane India Project"
    )
  );
  parts.push(
    paragraph(
      "This is not a story about a single bird. It is a story about what site fidelity means for a species at the edge of its viable population. The crane does not search for an equivalent mound when its home floods. It stays. It tries again. And if the wetland dries because the glaciers feeding it have retreated too far, or floods because meltwater arrives too fast and too high, the mound is gone and the pair's attachment to a place that no longer serves them becomes a vulnerability from which recovery is not certain."
    )
  );
  parts.push(
    paragraph(
      "Anurag Maloo, who first encountered black-necked cranes in Phobjikha Valley, Bhutan, in January 2016, asked Dr. Pankaj Chandan specifically about the behavioural shifts he had observed in recent years. The answer was grounded and specific: breeding timing is affected by extreme weather events; chick survival is vulnerable when flooding occurs in the critical early weeks; migration timing can be disrupted by localised food availability near human settlements. In November 2024, a group of cranes near Tso Moriri delayed their autumn departure because they had found reliable food at garbage dumps near army camps. After senior military authorities were alerted and the dumps cleared, the cranes departed."
    )
  );
  parts.push(
    await photo(
      "A flock of black-necked cranes at their wintering grounds in Shigatse, Tibet",
      "Dr. Pankaj Chandan · Black-necked Crane & Climate Change · Used with permission"
    )
  );
  parts.push(
    paragraph(
      "The black-necked crane's migration connects Ladakh's breeding grounds with wintering sites in Bhutan's Phobjikha Valley and Arunachal Pradesh's Zemithang and Sangti valleys, and with the vast breeding marshes of Ruoergai in Gansu, China — where some 4,000 birds breed alongside the headwaters of the Yellow River. In Phobjikha, invasive plant species are already occupying wetlands as temperatures change, degrading overwintering habitat. The Central Asian Flyway links 30 countries. High-altitude wetlands are its airports; remove two or three and the entire network begins to fail for millions of migratory birds."
    )
  );
  parts.push(
    await photo(
      "Bar-headed goose on a glacier-fed high-altitude lake in Ladakh",
      "Dr. Pankaj Chandan · Black-necked Crane & Climate Change · Used with permission"
    )
  );
  parts.push(
    await photo(
      "Migratory birds in flight over a high-altitude glacial lake in Ladakh",
      "Dr. Pankaj Chandan · Black-necked Crane & Climate Change · Used with permission"
    )
  );
  parts.push(
    await photo(
      "Changpa nomadic community at high-altitude encampment, Changthang Plateau",
      "Dr. Pankaj Chandan · Black-necked Crane & Climate Change · Used with permission"
    )
  );

  parts.push(kicker("Adaptation, Conflict, and the Long View"));
  parts.push(heading("Small Glaciers, Large Consequences"));
  parts.push(
    paragraph(
      "Dr. Yash Veer Bhatnagar's examination of small glaciers offered the session's most practically grounded contribution. Bodies of ice covering just a few hectares — visible as tiny bright specks in satellite imagery of Ladakh's side valleys — sustain local water security for specific villages. The primary Indus River channel is largely unsuitable for local irrigation; it is the streams fed by small side-valley glaciers that sustain both agriculture and daily life. If large glaciers retreat by tens of metres over a decade, small glaciers of only a few hectares can disappear entirely in the same period. Some streams are already receiving water only from permafrost melt. The timeline for community water insecurity is within one to two generations in a very concrete sense."
    )
  );
  parts.push(
    await photo(
      "Remote high-altitude hamlet with cultivated terraces in Lahaul-Spiti — livelihoods contingent on glacier-fed streams",
      "Dr. Yash Veer Bhatnagar · Glaciers and Life · Used with permission"
    )
  );
  parts.push(
    paragraph(
      "The ice stupa concept — pioneered by Dr. Chewang Norphel and innovated further by Sonam Wangchuk — addresses a specific timing problem. Farmers at high altitude must prepare fields and sow seeds by early May to harvest before August frosts. In April and May, when water is most needed, side-valley streams carry minimal flow. Ice stupas — artificial ice structures built by diverting water through winter to lower, sheltered sites near villages — melt in spring and deliver water precisely into that critical window."
    )
  );
  parts.push(
    paragraph(
      "Archana Chatterjee drew attention to an institutional gap at the heart of this conversation. Under Indian wetland law, glaciers are excluded from the national wetland definition — despite the Ramsar Convention on Wetlands formally recognising them as wetlands. Glacier-fed wetlands fall within the definition; glaciers themselves do not. They are managed under separate cryospheric frameworks and different ministries. The result is a regulatory gap at precisely the interface where ecological and hydrological systems are most entangled. Romola Butalia, a writer and conservationist who participated in the session, underlined the point: wetland neglect in the Himalaya is already chronic for recognised wetlands; the exclusion of glaciers compounds a deficit rather than creating a new one."
    )
  );
  parts.push(
    callout({
      variant: "insight",
      title: "The Structural Argument",
      body: "The high-altitude wetlands of the HKH function simultaneously as biodiversity sanctuaries, water towers for rivers sustaining 29% of the global population, climate refugia, and the connective tissue of trans-Himalayan migration flyways. Glacier loss does not merely reduce their water supply. It alters temperature regimes, water-level dynamics, sediment loads, and seasonal timing in ways that no single species or community can adapt to independently. The ecological and hydrological systems are one system. The loss is one loss.",
    })
  );

  parts.push(kicker("What Realistic Progress Looks Like"));
  parts.push(heading("Bridges Between Science, Community, and Policy"));
  parts.push(
    paragraph(
      "Community-based conservation and managed tourism offer partial but real bridges between livelihoods and ecological integrity. Snow leopard tourism in Ladakh and Spiti has shifted community attitudes through direct economic benefit. When communities receive genuine income from the presence of a species, that species acquires value no regulation alone can create. Over-tourism is a documented problem in parts of Spiti; free-ranging dogs around tourist areas create pressure on snow leopard and wolf prey populations."
    )
  );
  parts.push(
    paragraph(
      "Dr. Pankaj Chandan recommended using the black-necked crane as a flagship species for wetland climate adaptation policy — precisely because its vulnerability is specific, documentable, and legible to policymakers and the public alike. The crane's migration across India, Bhutan, and China creates a natural case for the transboundary conservation networks that both speakers called for. IUCN's Glacier Action Network and its Red List of Ecosystems tool — which can assess entire ecosystems rather than individual species — represent institutional frameworks that could be applied to high-altitude Himalayan landscapes through regional partnerships."
    )
  );
  parts.push(
    paragraph(
      "Platforms like the Glacier Dialogues serve a specific function: not as technical repositories, but as communication bridges between upstream scientific observation and the downstream communities and policymakers who need to act on what is being observed. The glacier crisis is not invisible because the data does not exist. It is invisible because the data has not been translated into the language of decision-makers or the imagination of citizens. That gap is precisely what this series is designed to close."
    )
  );

  parts.push(kicker("What This Session Made Clear"));
  parts.push(
    orderedList([
      "Newly exposed glacial terrain requires centuries to become habitable through ecological succession. Glacier retreat does not create new habitat for any species in a timeframe that matters to conservation.",
      "India's 15 to 20 breeding pairs of black-necked cranes return to the same nesting mound for up to 18 consecutive years. Site-specific habitat loss — a flooded mound, a drying wetland — can eliminate a breeding pair with no possibility of replacement.",
      "Small glaciers of just a few hectares sustain village-level water security. Their disappearance creates water crises within one to two generations for communities with no alternative sources.",
      "Climate warming is enabling cash crop agriculture at previously uninhabitable elevations — an economic opportunity for mountain communities AND a driver of escalating human-wildlife conflict. Both are true simultaneously.",
      "Indian wetland law excludes glaciers from the national wetland definition, creating a regulatory gap at the most critical interface between cryosphere and biodiversity policy.",
      "The high-altitude wetlands of the HKH are airports in the Central Asian Flyway connecting 30 countries. Lose two or three and the flyway begins to fail for millions of migratory birds.",
      "Black carbon from diesel vehicles, brick kilns, and traditional cooking stoves accelerates localised glacier melt by reducing albedo — a solvable problem sitting at the intersection of transport, energy, and conservation policy.",
    ])
  );

  return parts.filter(Boolean).join("\n\n");
}

// ---------------------------------------------------------------------------
// 4. Create the post
// ---------------------------------------------------------------------------

async function main() {
  const entry = podcasts.find((p) => p.slug === "GD7");
  if (!entry) throw new Error('Could not find slug "GD7" in podcasts.js');

  console.log(`Building content for ${entry.slug}: ${entry.title}`);
  const images = extractBase64ImagesForSlug("GD7");
  console.log(`  Found ${images.size} embedded base64 images to migrate to the Media Library.`);

  const content = await buildContent(images, uploadBase64Image);

  // Featured image (from the existing external URL in podcasts.js)
  let featuredMediaId = null;
  if (entry.image?.startsWith("http")) {
    const imgRes = await fetch(entry.image);
    if (imgRes.ok) {
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const contentType = imgRes.headers.get("content-type") || "image/jpeg";
      const uploadRes = await fetch(`${SITE_URL}/wp-json/wp/v2/media`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": contentType,
          "Content-Disposition": 'attachment; filename="gd7-featured.jpg"',
        },
        body: buffer,
      });
      if (uploadRes.ok) {
        featuredMediaId = (await uploadRes.json()).id;
      } else {
        console.warn(`  ! Featured image upload failed: ${uploadRes.status}`);
      }
    }
  }

  // Ensure the 6 topic terms exist and collect their IDs.
  const topicNames = [
    "Biodiversity & Glaciers",
    "HKH Region",
    "Black-necked Crane",
    "Mountain Ecosystems",
    "World Biodiversity Day",
    "Human-Wildlife Conflict",
  ];
  const topicIds = [];
  for (const name of topicNames) {
    const searchRes = await fetch(
      `${SITE_URL}/wp-json/wp/v2/dialogue_topic?search=${encodeURIComponent(name)}`,
      { headers: { Authorization: authHeader } }
    );
    const found = searchRes.ok ? await searchRes.json() : [];
    let term = found.find((t) => t.name === name);
    if (!term) {
      const createRes = await fetch(`${SITE_URL}/wp-json/wp/v2/dialogue_topic`, {
        method: "POST",
        headers: { Authorization: authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (createRes.ok) term = await createRes.json();
    }
    if (term) topicIds.push(term.id);
  }

  // Re-running this script should update the existing post's content rather
  // than creating a duplicate (e.g. after fixing a block-markup bug).
  const existingRes = await fetch(
    `${SITE_URL}/wp-json/wp/v2/glacier_dialogue?slug=${entry.slug}&status=any`,
    { headers: { Authorization: authHeader } }
  );
  const existing = existingRes.ok ? await existingRes.json() : [];
  const existingPost = existing.find((p) => p.slug === entry.slug.toLowerCase());

  const body = {
    title: entry.title,
    slug: entry.slug,
    content,
    ...(featuredMediaId ? { featured_media: featuredMediaId } : {}),
    ...(topicIds.length ? { dialogue_topic: topicIds } : {}),
    meta: {
      dialogue_date: "2026-05-23",
      speaker_name: entry.speaker,
      video_link: entry.videoLink || "",
    },
  };
  // Only new posts default to draft — never silently downgrade an already-published one.
  if (!existingPost) {
    body.status = "draft";
  }

  const postRes = await fetch(
    `${SITE_URL}/wp-json/wp/v2/glacier_dialogue${existingPost ? `/${existingPost.id}` : ""}`,
    {
      method: "POST",
      headers: { Authorization: authHeader, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!postRes.ok) {
    throw new Error(`Failed to save post: ${postRes.status} ${await postRes.text()}`);
  }

  const post = await postRes.json();
  console.log(`\n${existingPost ? "Updated" : "Created"} post ID ${post.id} (status: ${post.status}).`);
  console.log(`Edit it: ${SITE_URL}/wp-admin/post.php?post=${post.id}&action=edit`);
  console.log("Review the blocks — validation warnings should be gone now.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
