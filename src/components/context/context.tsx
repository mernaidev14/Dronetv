import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
// Define the context type
interface AuthContextType {
  draftDetails: any | [];
  setDraftDetails: React.Dispatch<React.SetStateAction<any | []>>;
  AIGenData: any | [];
  setAIGenData: React.Dispatch<React.SetStateAction<any | []>>;
  isPublishedTrigured: boolean;
  setIsPublishedTrigured: React.Dispatch<React.SetStateAction<boolean>>;
  finalTemplate: any|[];
  setFinalTemplate:React.Dispatch<React.SetStateAction<any | []>>;
}

// Create context with a default value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [draftDetails, setDraftDetails] = useState<any | []>({});
  const[isPublishedTrigured,setIsPublishedTrigured]= useState<boolean>(false)
  const[finalTemplate,setFinalTemplate]=useState<any | []>({});

    const [AIGenData, setAIGenData] = useState<any>({
publishedId: "pub-b59c7b8cc50447b9",
  userId: "TEMP_USER_ID",
  draftId: "draft-cb5308629b7b46abb8a788eca4102ffd",
  templateSelection: "template-2",
  isEdited: false,
  lastModified: null,
  version: 1,
  content: {
    company: {
      name: "drone TV",
      logo: "https://dronetv-company-assets-store.s3.ap-south-1.amazonaws.com/companies/TEMP_USER_ID/draft-cb5308629b7b46abb8a788eca4102ffd/identity/company-logo/2025/08/29/84ab26071e12-AC-repair.jpg",
      industry: "Technology",
      established: "2025-08-29",
      location: "Nagpur, BR",
      metrics: {
        yearsInBusiness: "0+",
        projectsCompleted: "200+",
        clientsSatisfied: "150+"
      }
    },
    hero: {
      title: "Elevate Your Vision. Drone TV.",
      subtitle: "Transforming perspectives with cutting-edge drone technology. Precision aerial filming, guaranteed professional results. Experience the difference.",
      backgroundImage: "Professional drone in action - aerial photography",
      features: [
        "DGCA Certified Operations",
        "Advanced Drone Technology",
        "Professional Results Guaranteed"
      ],
      primaryAction: { text: "Explore Our Services", type: "primary" },
      secondaryAction: { text: "Get a Free Quote", type: "secondary" }
    },
    about: {
      story: "DroneTV soared into existence on August 29th, 2025, founded by Ayush S. Chouhan with a clear vision: to revolutionize industries through innovative drone technology and data-driven solutions.  Ayush's passion for aerial technology and his commitment to excellence laid the foundation for a company built on precision and innovation. This vision fueled the rapid development of DroneTV's unique approach to drone operations and data analysis.",
      mission: "To empower businesses with cutting-edge drone technology, delivering unparalleled precision and efficiency while ensuring the highest standards of safety and regulatory compliance, thereby transforming operational processes and driving significant cost savings.",
      vision: "To be the leading provider of drone-based solutions, shaping the future of aerial technology and its transformative impact across diverse industries, setting new benchmarks for safety, innovation, and operational excellence.",
      officeImage: "",
      visionPillars: [
        {
          title: "Safety First",
          description: "Uncompromising commitment to DGCA compliance and operational safety",
          icon: "🛡️"
        },
        {
          title: "Innovation",
          description: "Leveraging cutting-edge drone technology for superior results",
          icon: "💡"
        },
        {
          title: "Precision",
          description: "Delivering accurate, reliable data and services every time",
          icon: "🎯"
        },
        {
          title: "Partnership",
          description: "Building long-term relationships based on trust and results",
          icon: "🎯"
        }
      ],
      certifications: [
        "DGCA Remote Pilot License",
        "Professional Drone Operations Certification",
        "Advanced Aerial Photography Training",
        "Survey & Mapping Specialization"
      ],
      achievements: [
        "500+ Successful Drone Operations Completed",
        "DGCA Certified Pilots and Operations",
        "99.8% Project Success Rate Achieved",
        "₹2+ Crore in Client Cost Savings Delivered",
        "25+ Enterprise Clients Served Across Industries"
      ]
    },
    services: {
      heading: {
        head: "Professional Drone Services for Modern Business",
        desc: "Discover how drone TV's advanced drone technology solutions can transform your operations with precision, efficiency, and measurable cost savings."
      },
      services: [
        {
          title: "React Development Services",
          category: "Aerial Survey, Inspection, Photography",
          image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
          description: "Revolutionize your projects with our DGCA-compliant drone services. We deliver high-resolution aerial data and analysis, significantly reducing project timelines and costs. Experience centimeter-level accuracy and substantial savings compared to traditional methods.",
          features: [
            "High-resolution aerial imaging with 4K cameras",
            "Real-time data processing and analysis",
            "DGCA compliant flight operations",
            "Professional pilot certification"
          ],
          detailedDescription: "Our React development service combines modern web technologies with drone data visualization. We create responsive, interactive dashboards that display real-time drone data, flight paths, and analytics. Perfect for businesses looking to modernize their drone operation interfaces.",
          benefits: [
            "Reduce survey time by 70% compared to traditional methods",
            "Achieve centimeter-level accuracy in measurements",
            "Cost savings of ₹50,000-₹2,00,000 per project"
          ],
          process: [
            "Site assessment and flight planning",
            "DGCA approval and safety briefing",
            "Professional drone data collection",
            "Data processing and analysis",
            "Detailed report delivery with recommendations"
          ],
          pricing: "₹25,000-₹1,50,000 (based on project scope)",
          timeline: "2-10 days (based on project complexity)"
        },
        {
          title: "MERN Stack Development",
          category: "Aerial Survey, Inspection, Photography",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
          description: "Revolutionize your projects with our DGCA-compliant drone services. We deliver high-resolution aerial data and precise analysis, significantly reducing project timelines and costs. Experience the efficiency and accuracy of cutting-edge drone technology for superior business outcomes.",
          features: [
            "High-resolution aerial imaging with 4K cameras",
            "Real-time data processing and analysis",
            "DGCA compliant flight operations",
            "Professional pilot certification"
          ],
          detailedDescription: "Full-stack MERN development for comprehensive drone management platforms. We build end-to-end solutions including MongoDB databases for drone data storage, Express.js APIs, React frontends, and Node.js backends for complete drone operation management systems.",
          benefits: [
            "Reduce survey time by 70% compared to traditional methods",
            "Achieve centimeter-level accuracy in measurements",
            "Cost savings of ₹50,000-₹2,00,000 per project"
          ],
          process: [
            "Site assessment and flight planning",
            "DGCA approval and safety briefing",
            "Professional drone data collection",
            "Data processing and analysis",
            "Detailed report delivery with recommendations"
          ],
          pricing: "₹25,000-₹1,50,000 (based on project scope)",
          timeline: "2-10 days (based on project complexity)"
        }
      ],
      categories: [
        "All",
        "Aerial Survey, Inspection, Photography",
        "Software Development",
        "Technology Solutions"
      ]
    },
    products: {
      heading: {
        title: "Professional Drone Technology Solutions",
        heading: "Innovative Drone Solutions Built for Success",
        description: "Discover our suite of cutting-edge drone products designed to streamline operations, boost productivity, and drive exceptional results for your business.",
        trust: "for your business."
      },
      products: [
        {
          title: "DroneTV Professional Suite",
          category: "Drone Technology",
          image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
          description: "Professional-grade drone platform with advanced data collection and analysis capabilities.",
          features: ["4K Camera System", "RTK GPS Precision", "Auto-flight Planning", "Real-time Data Stream"],
          isPopular: true,
          categoryColor: "bg-blue-100 text-blue-800",
          detailedDescription: "Our flagship drone solution combines cutting-edge hardware with intelligent software for comprehensive aerial operations. Built for commercial use with DGCA compliance and professional-grade performance.",
          pricing: "From ₹8,50,000",
          timeline: "2-4 weeks delivery"
        }
      ],
      benefits: [
        {
          icon: "30",
          color: "red-accent",
          title: "30-Day Money Back",
          desc: "Try our drone solutions risk-free with our comprehensive guarantee."
        },
        {
          icon: "99%",
          color: "primary", 
          title: "99% Success Rate",
          desc: "Industry-leading success rate with proven drone operations."
        },
        {
          icon: "∞",
          color: "gradient",
          title: "Unlimited Support",
          desc: "Comprehensive training and ongoing technical assistance included."
        }
      ]
    },
    blog: {
      header: {
        badge: "Our Blog",
        title: "Latest Drone Technology Insights",
        desc: "Stay informed with our expert perspectives on drone industry trends, regulations, and innovative aerial solutions."
      },
      posts: [
        {
          id: 1,
          title: "DGCA Compliance Guidelines for Commercial Drone Operations",
          excerpt: "Understanding the latest DGCA regulations and how they impact commercial drone services in India.",
          image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
          category: "Regulations",
          date: "Aug 25, 2025",
          author: "Ayush S. Chouhan",
          content: "<p>DGCA compliance is essential for commercial drone operations in India. This comprehensive guide covers the latest regulatory requirements, licensing procedures, and operational guidelines that every drone service provider must follow.</p><h3>Key Compliance Requirements</h3><p>Remote Pilot Licenses, operational approvals, and insurance coverage are mandatory for commercial operations. Understanding these requirements ensures safe and legal drone operations across all industries.</p>"
        },
        {
          id: 2,
          title: "Advanced Drone Surveying: Accuracy vs Traditional Methods",
          excerpt: "Comparing drone surveying precision with conventional land surveying techniques and cost implications.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
          category: "Technology",
          date: "Aug 20, 2025",
          author: "Ayush S. Chouhan",
          content: "<p>Modern drone surveying achieves centimeter-level accuracy while completing projects 70% faster than traditional methods. RTK GPS technology and advanced sensors enable precise measurements for construction, agriculture, and environmental monitoring.</p><h3>Cost-Benefit Analysis</h3><p>Drone surveys typically cost 40-60% less than conventional methods while providing superior data quality and faster turnaround times.</p>"
        }
      ]
    },
    clients: {
      headline: {
        title: "Our Trusted Partners",
        description: "We're proud to collaborate with forward-thinking companies across various industries in India."
      },
      clients: [
        {
          name: "Infrastructure Solutions Pvt Ltd",
          image: "https://images.unsplash.com/photo-1662052955098-042b46e60c2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
        },
        {
          name: "AgriTech Innovations", 
          image: "https://images.unsplash.com/photo-1551263640-1c007852f616?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
        },
        {
          name: "Real Estate Developers Pvt Ltd",
          image: "https://images.unsplash.com/photo-1618588429012-0559f1cbc5aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
        },
        {
          name: "Environmental Consultancy",
          image: "https://images.unsplash.com/photo-1746047420047-03fc7a9b9226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
        }
      ],
      stats: [
        { value: "25+", label: "Enterprise Clients" },
        { value: "500+", label: "Operations Completed" },
        { value: "99.8%", label: "Success Rate" },
        { value: "₹2+Cr", label: "Cost Savings Delivered" }
      ] 
    },
    testimonials: {
      headline: {
        title: "What Our Clients Say",
        description: "Don't just take our word for it. Here's what our satisfied clients have to say about working with drone TV."
      },
      testimonials: [
        {
          name: "Rajesh Kumar",
          role: "Project Manager, Infrastructure Solutions Pvt Ltd",
          image: "https://images.unsplash.com/photo-1613473350016-1fe047d6d360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
          quote: "Working with drone TV transformed our site surveying process. Their drone technology reduced our survey time by 65% and provided incredibly accurate data. The cost savings were substantial - over ₹3 lakhs saved on our recent highway project.",
          rating: 5
        },
        {
          name: "Priya Sharma", 
          role: "Operations Director, AgriTech Innovations",
          image: "https://images.unsplash.com/photo-1584940120505-117038d90b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
          quote: "The precision of drone TV's agricultural drone services is outstanding. We can now identify crop issues 2 weeks earlier than traditional methods, leading to 20% better yield outcomes for our farmers.",
          rating: 5
        },
        {
          name: "Amit Patel",
          role: "Marketing Head, Real Estate Developers Pvt Ltd", 
          image: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
          quote: "drone TV's aerial photography services elevated our property marketing significantly. The stunning visuals helped us sell 30% faster and achieve 15% higher prices. Truly professional service.",
          rating: 5
        },
        {
          name: "Dr. Sunita Verma",
          role: "Senior Environmental Scientist, Environmental Consultancy",
          image: "https://images.unsplash.com/photo-1613473350016-1fe047d6d360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
          quote: "For our environmental monitoring projects, drone TV provided exceptional data accuracy and DGCA-compliant operations. Their detailed reports helped us secure regulatory approvals 40% faster.",
          rating: 4
        }
      ],
      stats: [
        { value: "4.9/5", label: "Average Rating" },
        { value: "25+", label: "Happy Clients" },
        { value: "500+", label: "Projects Delivered" },
        { value: "99.8%", label: "Success Rate" }
      ]
    },
    contact: {
      title: "Let's Connect",
      description: "Ready to start your project?",
      ctaButton: "Start Conversation",
      backgroundImage: "",
      benefits: []
    },
    faq: {
      title: "Frequently Asked Questions About Professional Drone Services",
      questions: [
        {
          question: "What DGCA certifications and licenses does drone TV maintain?",
          answer: "drone TV maintains full DGCA compliance with certified Remote Pilot Licenses, operational approvals for commercial activities, and comprehensive insurance coverage. All our pilots are trained and certified according to current DGCA regulations."
        },
        {
          question: "How accurate is drone surveying compared to traditional methods?",
          answer: "Our drone surveying achieves centimeter-level accuracy (±2-5cm) using RTK GPS technology, which is significantly more precise than traditional surveying methods. Projects are completed 70% faster while maintaining superior data quality."
        },
        {
          question: "What is the typical cost range for professional drone services?",
          answer: "Professional drone services typically range from ₹25,000 for basic aerial photography to ₹2,50,000+ for complex surveying projects. Costs depend on project scope, area coverage, data processing requirements, and timeline."
        },
        {
          question: "How long does a typical drone project take from start to completion?",
          answer: "Most drone projects are completed within 5-10 days including planning, data collection, processing, and report delivery. Simple aerial photography can be delivered within 24-48 hours, while complex mapping projects may require 2-3 weeks."
        },
        {
          question: "What weather conditions affect drone operations?",
          answer: "We operate safely in winds up to 15 m/s and light rain conditions. Operations are suspended during heavy rain, thunderstorms, or extreme weather. We monitor conditions closely and reschedule when necessary to ensure safety and data quality."
        },
        {
          question: "Can you operate drones in urban areas and controlled airspace?",
          answer: "Yes, we have experience operating in urban environments and controlled airspace. We handle all DGCA approvals, coordinate with air traffic control when required, and ensure full compliance with local regulations and safety protocols."
        },
        {
          question: "What kind of data and reports do you provide after drone operations?",
          answer: "We deliver high-resolution images, processed maps, 3D models, CAD files, detailed analysis reports, and raw data in various formats. All deliverables include metadata, accuracy assessments, and compliance documentation."
        },
        {
          question: "Do you provide training for drone equipment purchases?",
          answer: "Yes, we offer comprehensive training programs including DGCA certification preparation, hands-on flight training, maintenance procedures, and ongoing technical support. Training packages are customized based on your specific equipment and operational needs."
        }
      ]
    }
  }
});

const navigate = useNavigate();

async function FetchAPI(){
   const response= await fetch(`https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${AIGenData.userId}/update/${AIGenData.publishedId}`,{
    method: 'PUT',
    
    body: JSON.stringify(finalTemplate)
   })
   const res = await response.json()

   if(response.ok){
    console.log("response:", res);
    navigate("/user/companies")
   }
}

function publishTemplate(){
     setIsPublishedTrigured(true)
     FetchAPI()
    }
    
    useEffect(()=>{
      console.log("finalData:",finalTemplate)
    
        },[finalTemplate])

  return (
    <AuthContext.Provider value={{ draftDetails, setDraftDetails, AIGenData, setAIGenData, isPublishedTrigured, setIsPublishedTrigured,setFinalTemplate, finalTemplate, publishTemplate }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
