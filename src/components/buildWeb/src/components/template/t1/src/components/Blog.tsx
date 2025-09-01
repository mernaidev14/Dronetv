import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import blog1 from "../public/images/blog/blog1.jpg";
import blog2 from "../public/images/blog/blog2.jpg";
import blog3 from "../public/images/blog/blog3.jpg";

const blogs = [
  {
    id: 1,
    title: "The Future of AI in Business",
    excerpt: "AI is transforming industries...",
    content:
      "Artificial Intelligence (AI) is no longer just a buzzword — itʼs becoming the backbone of modern business transformation. From automating routine tasks to enabling data-driven decision-making, AI is fundamentally reshaping how companies operate and compete.One of the biggest advantages AI brings is efficiency. Intelligent systems can analyze vast amounts of data in seconds, identify trends, and provide actionable insights that humans would take weeks to discover. This allows organizations to respond faster to market changes and customer needs.Another area where AI is driving change is customer experience. Personalized recommendations, virtual assistants, and predictive support powered by AI are helping businesses build stronger connections with their customers, often leading to higher loyalty and retention.",
    image: blog1,
    category: "Technology",
    date: "Aug 20, 2025",
  },
  {
    id: 2,
    title: "Innovation Trends to Watch",
    excerpt: "Staying ahead means staying innovative...",
    content: "Full content of innovation blog...",
    image: blog2,
    category: "Innovation",
    date: "Aug 18, 2025",
  },
  {
    id: 3,
    title: "Building Resilient Tech Strategies",
    excerpt: "Resilience is the key...",
    content: "Full content of resilience blog...",
    image: blog3,
    category: "Strategy",
    date: "Aug 15, 2025",
  },
];

export default function Blog({
  onSelectBlog,
}: {
  onSelectBlog: (blog: any) => void;
}) {
  return (
    <section
      id='blog'
      className='py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500 scroll-mt-20'
    >
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300'>
            Latest Blogs
          </h2>
          <p className='text-gray-600 dark:text-gray-300 transition-colors duration-300'>
            Stay updated with our latest insights.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {blogs.map((b) => (
            <Card
              key={b.id}
              className='shadow-lg hover:shadow-2xl dark:shadow-gray-700/30 dark:hover:shadow-gray-600/40 dark:bg-gray-700 transition-all duration-300'
            >
              <img src={b.image} className='w-full h-48 object-cover' />
              <CardContent className='p-6'>
                <p className='text-sm text-gray-500 dark:text-gray-400 p-2 transition-colors duration-300'>
                  {b.date} • {b.category}
                </p>
                <h3 className='text-xl font-semibold px-2 pb-2 text-gray-900 dark:text-white transition-colors duration-300'>
                  {b.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 p-2 transition-colors duration-300'>
                  {b.excerpt}
                </p>
                <Button
                  variant='ghost'
                  className='text-red-500 dark:text-red-400 p-2 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-300'
                  onClick={() => onSelectBlog(b)}
                >
                  Read More →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
