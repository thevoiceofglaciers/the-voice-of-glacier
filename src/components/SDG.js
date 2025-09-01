"use client";

export default function SDGGrid() {
  const sdgData = [
    { id: 1, title: "No Poverty", description: "End poverty in all its forms everywhere.", color: "bg-red-600" },
    { id: 2, title: "Zero Hunger", description: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture.", color: "bg-yellow-500" },
    { id: 3, title: "Good Health and Well-Being", description: "Ensure healthy lives and promote well-being for all at all ages.", color: "bg-green-600" },
    { id: 4, title: "Quality Education", description: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.", color: "bg-red-500" },
    { id: 5, title: "Gender Equality", description: "Achieve gender equality and empower all women and girls.", color: "bg-pink-500" },
    { id: 6, title: "Clean Water and Sanitation", description: "Ensure availability and sustainable management of water and sanitation for all.", color: "bg-sky-500" },
    { id: 7, title: "Affordable and Clean Energy", description: "Ensure access to affordable, reliable, sustainable and modern energy for all.", color: "bg-yellow-400" },
    { id: 8, title: "Decent Work and Economic Growth", description: "Promote sustained, inclusive and sustainable economic growth", color: "bg-pink-600" },
    { id: 9, title: "Industry, Innovation and Infrastructure", description: "Build resilient infrastructure, promote sustainable industrialization.", color: "bg-orange-500" },
    { id: 10, title: "Reduced Inequalities", description: "Reduce inequality within and among countries.", color: "bg-pink-400" },
    { id: 11, title: "Sustainable Cities and Communities", description: "Make cities and human settlements inclusive, safe, resilient and sustainable.", color: "bg-yellow-400" },
    { id: 12, title: "Responsible Consumption and Production", description: "Ensure sustainable consumption and production patterns.", color: "bg-yellow-600" },
    { id: 13, title: "Climate Action", description: "Take urgent action to combat climate change and its impacts.", color: "bg-green-700" },
    { id: 14, title: "Life Below Water", description: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development.", color: "bg-blue-600" },
    { id: 15, title: "Life on Land", description: "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests.", color: "bg-green-800" },
    { id: 16, title: "Peace, Justice and Strong Institutions", description: "Promote peaceful and inclusive societies for sustainable development.", color: "bg-blue-900" },
    { id: 17, title: "Partnerships for the Goals", description: "Strengthen the means of implementation and revitalize the global partnership for sustainable development.", color: "bg-indigo-700" },
  ];

  return (
    <section className="w-full py-12">
      <div className="w-[90%] md:w-[80%] mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">17 Sustainable Development Goals</h2>
        <p className="text-sm text-gray-600 mt-2">
          Adopted by all United Nations Member States in 2015 as a universal call to action.
        </p>
      </div>

      <div className="w-[90%] md:w-[80%] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
        {sdgData.map((goal) => (
          <div
            key={goal.id}
            className={`relative group w-full h-40 sm:h-48 md:h-52 bg-center bg-cover bg-no-repeat cursor-pointer`}
            style={{
              backgroundImage: `url(https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/sdgs/${goal.id}-bg.webp)`,
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
