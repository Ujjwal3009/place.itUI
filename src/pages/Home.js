import '../styles/Home.css';
import Placelist from '../components/Placelist';

const Home = () => {
  // Function to get random image dimensions
  const getRandomSize = () => {
    const heights = ['400', '500', '600', '700', '800'];
    const widths = ['400', '500', '600'];
    return {
      width: widths[Math.floor(Math.random() * widths.length)],
      height: heights[Math.floor(Math.random() * heights.length)]
    };
  };

  const trendingPlacelists = [
    {
      id: 1,
      title: "Hidden Gems of Japan",
      description: "Discover lesser-known but amazing spots across Japan",
      author: "TravelExplorer",
      saves: 1200,
      places: Array(50).fill(null).map((_, index) => {
        const { width, height } = getRandomSize();
        return {
          id: index + 1,
          name: `Beautiful Place ${index + 1}`,
          location: `Location ${index + 1}, Country`,
          image: `https://placehold.co/${width}x${height}`,
          images: [`https://placehold.co/${width}x${height}`],
          tags: ["Nature", "Cultural", "Photography"],
          address: `Address line ${index + 1}, City, Country`,
          description: `This is a beautiful place with lots to see and do. Location ${index + 1} is known for its amazing views and local culture.`
        };
      })
    },
    {
      id: 2,
      title: "European Coffee Shops",
      description: "Best coffee spots in Europe's most charming cities",
      author: "CoffeeNomad",
      saves: 890,
      places: [
        {
          id: 1,
          name: "Café Central",
          location: "Vienna, Austria",
          image: "https://placehold.co/600x400",
          tags: ["Coffee", "Historic", "Food"]
        },
        {
          id: 2,
          name: "La Caféothèque",
          location: "Paris, France",
          image: "https://placehold.co/600x400",
          tags: ["Coffee", "Cozy", "Food"]
        }
      ]
    }
  ];

  return (
    <div className="home">
      <h1 className="home-title">Discover Your Next Adventure</h1>

      <section className="trending-section">
        <h2>Trending Placelists</h2>
        <div className="placelists-container">
          {trendingPlacelists.map((list) => (
            <Placelist
              key={list.id}
              title={list.title}
              description={list.description}
              places={list.places}
              author={list.author}
              saves={list.saves}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 