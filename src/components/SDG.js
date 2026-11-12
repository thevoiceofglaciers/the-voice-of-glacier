"use client";

// Official SDG colours by goal number (position in the list) — kept in code
// so Tailwind can see the class names; the text and tiles come from WordPress.
const SDG_COLORS = [
  "bg-red-600", "bg-yellow-500", "bg-green-600", "bg-red-500", "bg-pink-500", "bg-sky-500",
  "bg-yellow-400", "bg-pink-600", "bg-orange-500", "bg-pink-400", "bg-yellow-400", "bg-yellow-600",
  "bg-green-700", "bg-blue-600", "bg-green-800", "bg-blue-900", "bg-indigo-700",
];

export default function SDGGrid({ title, intro, goals = [] }) {
  const sdgData = goals.map((goal, i) => ({
    ...goal,
    id: i + 1,
    color: SDG_COLORS[i] || "bg-glacier-primary",
  }));

  return (
    <section className="w-full py-12">
      <div className="w-[90%] md:w-[80%] mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        {intro && <p className="text-sm text-gray-600 mt-2">{intro}</p>}
      </div>

      <div className="w-[90%] md:w-[80%] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
        {sdgData.map((goal) => (
          <div
            key={goal.id}
            className={`relative group w-full h-40 sm:h-48 md:h-52 bg-center bg-cover bg-no-repeat cursor-pointer`}
            style={{
              backgroundImage: goal.image ? `url(${goal.image})` : undefined,
            }}
          >
            {/* Hover Overlay with dynamic color */}
            <div
              className={`absolute inset-0 ${goal.color} opacity-0 group-hover:opacity-90 transition duration-300 flex flex-col justify-center items-center text-white text-center p-3`}
            >
              <h3 className="text-sm font-bold mb-1 text-wrap">
                Goal {goal.id}: {goal.title}
              </h3>
              <p className="text-xs">{goal.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
