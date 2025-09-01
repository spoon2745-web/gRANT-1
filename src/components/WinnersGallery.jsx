import Image from 'next/image';
const winners = [
    {
        src: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=1200&auto=format&fit=crop',
        title: 'Community Training',
    },
    {
        src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
        title: 'Entrepreneurship',
    },
    {
        src: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
        title: 'STEM Workshop',
    },
];
export default function WinnersGallery() {
    return (<section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="display-title text-3xl md:text-4xl font-bold tracking-tight mb-3 bg-animated-gradient bg-clip-text text-transparent">Previous Grant Winners</h2>
          <p className="text-gray-600">Stories of impact from around the world.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {winners.map((w, idx) => (<div key={idx} className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500">
              <Image src={w.src} alt={w.title} width={600} height={400} className="h-64 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"/>
              <div className="absolute bottom-0 p-4 text-white">
                <h3 className="text-lg font-semibold">{w.title}</h3>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
