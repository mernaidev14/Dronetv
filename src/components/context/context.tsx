import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

// User Authentication Types and Context
interface User {
  email: string;
  fullName: string;
  token?: string;
  // Add other user properties as needed
}

interface UserAuthContextType {
  user: User | null;
  isLogin: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

interface UserAuthProviderProps {
  children: ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLogin = !!user;

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, isLogin, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}

// Template Management Types and Context
interface TemplateContextType {
  draftDetails: any | [];
  setDraftDetails: React.Dispatch<React.SetStateAction<any | []>>;
  AIGenData: any | [];
  setAIGenData: React.Dispatch<React.SetStateAction<any | []>>;
  isPublishedTriggered: boolean;
  setIsPublishedTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  finalTemplate: any | [];
  setFinalTemplate: React.Dispatch<React.SetStateAction<any | []>>;
  publishTemplate: () => void;  

  finaleDataReview: any |[];
  setFinaleDataReview: React.Dispatch<React.SetStateAction<any | []>>;
  editPublishTemplate: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ children }) => {
  const [draftDetails, setDraftDetails] = useState<any | []>({});
  const [isPublishedTriggered, setIsPublishedTriggered] = useState<boolean>(false);
  const [finalTemplate, setFinalTemplate] = useState<any | []>({});
  const [AIGenData, setAIGenData] = useState<any>({
    publishedId: "pub-889ee60a25e143a0",
    userId: "example@gmail.com",
    draftId: "draft-5e3c0c6322a240898cb1807a73c2f6a8",
    templateSelection: "template-1",
    isEdited: false,
    lastModified: "2025-09-09T08:37:22.802970",
    version: 1,
    content: {
        company: {
            name: "",
            logo: "",
            industry: "Drone Technology Solutions",
            established: "",
            location: "",
            metrics: {
                yearsInBusiness: "5+",
                projectsCompleted: "250+",
                clientsSatisfied: "50+"
            }
        },
        hero: {
            heading: "Revolutionizing Perspectives with Dr...",
            subheading: "Transform your projects with precisi...",
            description: "We believe in turning bold ideas into lasting impact.  delivers solutions that blend technology, creativity, and purpose. Driving innovation that shapes industries and communities.",
            mainHeroImage: "Professional drone in action - aerial photography",
            secHeroImage: "Professional drone in action - aerial photography",
            numberOfClients: "500",
            clientImage1: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
            clientImage2: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
            clientImage3: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
            clientImage4: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
            clientImage5: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
            clientImage6: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
            primaryAction: {
                type: "primary",
                text: "Get Quote"
            },
            secondaryAction: {
                type: "secondary",
                text: "View Portfolio"
            }
        },
        about: {
            companyName: "",
            industry: "Drone Technology Solutions",
            established: "",
            headquarters: "",
            description1: "Founded in 2020 by [Founder's Name], [Company Name] was born from a vision to provide reliable and innovative drone services. Driven by a passion for cutting-edge technology and a commitment",
            description2: "to safety, we aimed to redefine aerial data acquisition. Our early projects focused on building a strong foundation of expertise",
            mission: "To provide safe, reliable, and innovative drone technology solutions that empower businesses and improve lives.",
            vision: "To be the leading provider of cutting-edge drone technology, shaping the future of aerial data acquisition and analysis.",
            officeImage: "",
            certifications: [
                "DGCA Remote Pilot License",
                "Professional Drone Operations Certification",
                "Advanced Aerial Photography Training"
            ],
            achievements: [
                "500+ Successful Drone Operations Completed",
                "DGCA Certified Pilots and Operations",
                "99.8% Project Success Rate Achieved"
            ]
        },
        services: {
            heading: {
                head: "Professional Drone Services",
                desc: "Comprehensive aerial solutions designed to transform business operations with precision, efficiency, and measurable results across  and beyond."
            },
            services: [
                {
                    benefits: [
                        "Reduce survey time by 80% compared to traditional ground methods",
                        "Achieve accuracy levels within 2-3cm tolerance for critical measurements",
                        "Cost savings of ₹2-5 lakhs per large-scale surveying project"
                    ],
                    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    features: [
                        "Sub-centimeter accuracy RTK GPS mapping",
                        "Real-time data processing and visualization",
                        "3D terrain modeling and point cloud generation",
                        "DGCA compliant flight operations with certified pilots"
                    ],
                    process: [
                        "Comprehensive site assessment and detailed flight planning",
                        "DGCA clearance acquisition and safety protocol implementation",
                        "Professional drone deployment with RTK GPS precision systems",
                        "Real-time data collection with continuous quality monitoring",
                        "Advanced post-processing and comprehensive report generation"
                    ],
                    detailedDescription: "Our aerial surveying services utilize advanced drone technology with RTK GPS systems to provide accurate topographical data, construction progress monitoring, and comprehensive infrastructure assessment. We deliver precise measurements and detailed analytical reports that enable informed decision-making for your projects.",
                    description: "High-precision aerial surveys for construction, infrastructure development, and land management with centimeter-level accuracy.",
                    timeline: "3-7 days depending on area coverage and complexity",
                    title: "Aerial Survey & Mapping",
                    category: "Surveying",
                    pricing: "₹25,000 - ₹1,50,000 per project"
                },
                {
                    benefits: [
                        "Eliminate safety risks for inspection personnel in hazardous areas",
                        "Reduce inspection time by 70% while improving coverage accuracy",
                        "Prevent equipment failures saving ₹10-50 lakhs in potential damages"
                    ],
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    features: [
                        "Advanced thermal imaging for heat detection and analysis",
                        "High-resolution visual inspection with zoom capabilities",
                        "Automated flight paths for consistent inspection coverage",
                        "Detailed defect identification and classification reporting"
                    ],
                    process: [
                        "Pre-inspection facility analysis and risk assessment planning",
                        "Customized flight path programming for optimal coverage",
                        "Multi-sensor data collection including thermal and visual imaging",
                        "Advanced analytics and defect identification processing",
                        "Prioritized maintenance recommendations and action plan delivery"
                    ],
                    detailedDescription: "Our industrial inspection services combine thermal and visual imaging technologies to identify potential issues in infrastructure, power lines, solar installations, and manufacturing facilities. We provide comprehensive condition assessments that help prevent costly failures and optimize maintenance schedules.",
                    description: "Comprehensive industrial facility inspections using thermal imaging and high-resolution cameras for safety and maintenance optimization.",
                    timeline: "2-5 days including analysis and reporting",
                    title: "Industrial Inspection Services",
                    category: "Inspection",
                    pricing: "₹35,000 - ₹2,00,000 per inspection project"
                },
                {
                    benefits: [
                        "Increase crop yields by 15-25% through precision farming techniques",
                        "Reduce water usage by 30% with targeted irrigation planning",
                        "Save ₹1-3 lakhs annually per 100 acres through optimized input usage"
                    ],
                    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    features: [
                        "Multispectral and NDVI imaging for crop health analysis",
                        "Precision irrigation planning and water management optimization",
                        "Pest and disease early detection and monitoring systems",
                        "Yield prediction and harvest optimization planning"
                    ],
                    process: [
                        "Farm mapping and baseline crop health assessment",
                        "Regular monitoring flights with multispectral data collection",
                        "Advanced analytics and crop health index calculation",
                        "Targeted treatment recommendations and application planning",
                        "Yield prediction and harvest timing optimization guidance"
                    ],
                    detailedDescription: "Our agricultural drone services leverage multispectral imaging and advanced analytics to provide farmers with actionable insights for crop management. We help optimize irrigation, identify pest issues early, and maximize crop yields through data-driven farming decisions.",
                    description: "Precision agriculture solutions using multispectral imaging for crop health monitoring, yield optimization, and sustainable farming practices.",
                    timeline: "Ongoing monitoring with weekly/monthly flight schedules",
                    title: "Agricultural Monitoring & Analysis",
                    category: "Agriculture",
                    pricing: "₹15,000 - ₹75,000 per season per 100 acres"
                },
                {
                    benefits: [
                        "Increase property inquiry rates by 40-60% with aerial marketing",
                        "Reduce time-to-sale by 25% through enhanced visual presentation",
                        "Professional content creation saving ₹50,000-₹2,00,000 in marketing costs"
                    ],
                    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    features: [
                        "4K Ultra HD video recording with cinematic stabilization",
                        "Professional photography with multiple angle perspectives",
                        "Virtual tour creation and 360-degree panoramic imaging",
                        "Fast turnaround editing and post-production services"
                    ],
                    process: [
                        "Property assessment and optimal shooting time planning",
                        "Professional aerial photography and videography capture",
                        "Advanced editing and post-production enhancement",
                        "Multiple format delivery for various marketing channels",
                        "Marketing consultation and content optimization advice"
                    ],
                    detailedDescription: "Our real estate photography services showcase properties from unique aerial perspectives that drive buyer interest and accelerate sales. We create compelling visual content that highlights property features, location advantages, and development potential for maximum marketing impact.",
                    description: "Professional aerial photography and videography services for real estate marketing, property development documentation, and promotional content creation.",
                    timeline: "2-4 days from shoot to final delivery",
                    title: "Real Estate & Marketing Photography",
                    category: "Photography",
                    pricing: "₹20,000 - ₹1,00,000 per property shoot"
                },
                {
                    benefits: [
                        "Reduce project delays by 20% through proactive monitoring",
                        "Improve safety compliance with regular hazard identification",
                        "Save ₹5-20 lakhs through optimized resource planning and management"
                    ],
                    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    features: [
                        "Regular progress documentation with time-lapse creation",
                        "3D site modeling and volume calculation accuracy",
                        "Safety compliance monitoring and hazard identification",
                        "Stakeholder reporting with visual progress comparisons"
                    ],
                    process: [
                        "Initial site mapping and baseline documentation establishment",
                        "Scheduled monitoring flights with consistent data collection",
                        "Progress analysis and comparison with project timelines",
                        "Safety assessment and compliance verification reporting",
                        "Stakeholder communication with visual progress updates"
                    ],
                    detailedDescription: "Our construction monitoring services provide project managers with accurate, real-time insights into build progress, material quantities, and site safety conditions. We deliver comprehensive documentation that supports project planning, quality control, and stakeholder communication.",
                    description: "Comprehensive construction site monitoring with progress tracking, safety compliance verification, and stakeholder reporting for project management optimization.",
                    timeline: "Weekly or bi-weekly monitoring with rapid reporting",
                    title: "Construction Progress Monitoring",
                    category: "Construction",
                    pricing: "₹30,000 - ₹1,25,000 per month per site"
                },
                {
                    benefits: [
                        "Reduce search time by 60% in emergency situations",
                        "Provide critical intelligence without risking personnel safety",
                        "Support coordination saving valuable time in life-critical situations"
                    ],
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    features: [
                        "Rapid deployment within 30 minutes of emergency call",
                        "Thermal imaging for search and rescue operations",
                        "Real-time video streaming to command centers",
                        "GPS coordinate mapping for precise location identification"
                    ],
                    process: [
                        "Emergency activation and rapid response deployment",
                        "Coordinate with emergency services and command centers",
                        "Real-time aerial surveillance and data collection",
                        "Live streaming and GPS coordinate transmission",
                        "Post-operation reporting and documentation"
                    ],
                    detailedDescription: "Our emergency response services provide critical aerial support during disasters, search operations, and emergency situations. We work closely with emergency services to provide real-time intelligence and coordinate rescue efforts effectively.",
                    description: "Rapid deployment drone services for emergency response, search and rescue operations, and disaster assessment with real-time coordination capabilities.",
                    timeline: "Immediate deployment with 24/7 availability",
                    title: "Emergency Response & Search Operations",
                    category: "Emergency Services",
                    pricing: "₹50,000 - ₹2,50,000 per emergency operation"
                }
            ],
            categories: [
                "All",
                "Construction",
                "Surveying",
                "Agriculture",
                "Inspection",
                "Photography",
                "Emergency Services"
            ]
        },
        products: {
            heading: {
                title: "Professional Products",
                heading: "Innovative Solutions Built for Success",
                description: "Quality drone solutions.",
                trust: "for your business."
            },
            products: [
                {
                    title: "Drone System",
                    category: "Technology",
                    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    description: "Professional drone solution.",
                    features: [
                        "Advanced Technology",
                        "Professional Grade",
                        "Expert Support",
                        "Reliable Performance"
                    ],
                    isPopular: true,
                    categoryColor: "bg-blue-100 text-blue-800",
                    detailedDescription: "Professional solution with cutting-edge technology for business operations.",
                    pricing: "From ₹5,00,000",
                    timeline: "2-4 weeks delivery"
                }
            ],
            benefits: [
                {
                    icon: "30",
                    color: "red-accent",
                    title: "30-Day Money Back",
                    desc: "Try our solutions risk-free with our comprehensive guarantee."
                },
                {
                    icon: "99%",
                    color: "primary",
                    title: "99% Success Rate",
                    desc: "Industry-leading success rate with proven operations."
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
                title: "Drone Technology Blog",
                badge: "Latest Insights",
                desc: "Stay updated with latest trends in aerial technology and industry insights from our experts."
            },
            posts: [
                {
                    date: "2025-08-25",
                    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
                    author: "",
                    readTime: "5 min read",
                    id: 1.0,
                    title: "DGCA Regulations 2025: What Drone Operators Need to Know",
                    excerpt: "Complete guide to latest DGCA drone regulations and compliance requirements for commercial operations in India.",
                    category: "Regulations",
                    content: "<h1>Understanding the 2025 DGCA Drone Regulations</h1><p>The Directorate General of Civil Aviation (DGCA) in India has implemented updated regulations for drone operations in 2025.  These changes significantly impact commercial drone usage, requiring operators to understand and comply with new safety and operational standards. This guide breaks down the key aspects you need to know.</p><h2>Key Changes in DGCA Regulations 2025</h2><p>This section will detail specific changes in the 2025 regulations, such as new licensing requirements, operational limitations, and airspace restrictions.  Specific examples and clarifications will be provided to ensure clarity.</p><h2>Compliance and Certification Procedures</h2><p>This section will outline the steps involved in obtaining the necessary licenses and certifications to operate drones commercially under the new DGCA regulations. We'll cover application processes, documentation requirements, and timelines.</p><h2>Impact on Different Drone Applications</h2><p>The new regulations affect various drone applications differently. This section will explore the implications for sectors like surveying, inspection, photography, and delivery, providing specific examples for each.</p><h2>Staying Compliant and Avoiding Penalties</h2><p>This section will offer practical advice on maintaining compliance with the DGCA regulations, including best practices for record-keeping, safety protocols, and how to address potential violations.  We'll also discuss the penalties for non-compliance.</p>"
                },
                {
                    date: "2025-08-20",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
                    author: "",
                    readTime: "7 min read",
                    id: 2.0,
                    title: "Advanced Drone Surveying: Precision vs Traditional Methods",
                    excerpt: "Comparing drone surveying accuracy with conventional land surveying techniques and cost implications.",
                    category: "Technology",
                    content: "<h1>Drone Surveying: A Revolution in Accuracy and Efficiency</h1><p>Traditional land surveying methods, while reliable, are often time-consuming and expensive.  Drone surveying offers a compelling alternative, leveraging advanced technology to deliver precise data with increased speed and reduced costs.  This article compares both approaches.</p><h2>Accuracy and Precision: Drone Surveying vs. Traditional Methods</h2><p>A detailed comparison of the accuracy achievable through both methods, highlighting the advantages of drone-based solutions in terms of data density and precision.  Specific examples and case studies will be included.</p><h2>Cost-Benefit Analysis: Weighing the Investment</h2><p>This section will present a comprehensive cost-benefit analysis, comparing the expenses associated with traditional surveying (labor, equipment, time) against the costs of drone surveying (initial investment, operational costs). We'll showcase scenarios where drone surveying provides a clear return on investment.</p><h2>Data Processing and Analysis: Leveraging Advanced Technology</h2><p>This section will discuss the advanced data processing and analysis techniques used in drone surveying, emphasizing the efficiency and accuracy gains compared to traditional methods.  We will explore the use of photogrammetry and other relevant technologies.</p><h2>Real-World Applications and Case Studies</h2><p>This section will showcase successful applications of drone surveying across various industries, highlighting real-world examples and quantifiable results.  This will demonstrate the practical benefits and ROI achievable with drone-based surveying solutions.</p>"
                },
                {
                    date: "2025-08-15",
                    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
                    author: "",
                    readTime: "6 min read",
                    id: 3.0,
                    title: "ROI Analysis: Why Businesses Choose Drone Solutions",
                    excerpt: "Data-driven analysis of return on investment from drone technology adoption across industries.",
                    category: "Business",
                    content: "<h1>Unlocking Business Value: The ROI of Drone Technology</h1><p>In today's competitive landscape, businesses are constantly seeking ways to improve efficiency, reduce costs, and gain a competitive edge. Drone technology offers a powerful solution across numerous industries, delivering significant returns on investment (ROI).</p><h2>Increased Efficiency and Productivity</h2><p>This section will detail how drone technology streamlines operations, reduces manual labor, and speeds up data acquisition processes.  Specific examples from various industries will illustrate the time and labor savings achieved.</p><h2>Cost Reduction and Savings</h2><p>We'll analyze how drone technology leads to cost reductions in areas such as labor, equipment, and travel expenses.  We will provide concrete examples of cost savings achieved by businesses using drones.</p><h2>Improved Data Accuracy and Decision-Making</h2><p>This section will highlight the superior data accuracy and precision offered by drone technology, leading to better-informed business decisions and reduced risks.  We'll discuss how this translates into tangible financial benefits.</p><h2>Real-World Case Studies: Demonstrating ROI</h2><p>This section will showcase real-world case studies from various industries, quantifying the ROI achieved by businesses that have adopted drone solutions.  These examples will provide concrete evidence of the financial benefits.</p><h2>Future Trends and Opportunities</h2><p>This section will discuss emerging trends in drone technology and their potential to further enhance ROI in the coming years.  We'll explore opportunities for businesses to leverage these advancements for even greater financial gains.</p>"
                }
            ]
        },
        clients: {
            headline: {
                title: "Trusted by Leading Organizations",
                description: "We've worked with diverse clients across industries to deliver exceptional aerial solutions in  and beyond."
            },
            clients: [
                {
                    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
                    name: "Infrastructure Solutions Pvt Ltd",
                    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                },
                {
                    logo: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
                    name: "AgriTech Innovations",
                    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                },
                {
                    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
                    name: "Property Developers Ltd",
                    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                },
                {
                    logo: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
                    "name": "Environmental Consultancy",
                    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                }
            ],
            stats: [
                {
                    value: "250+",
                    label: "Projects Completed"
                },
                {
                    value: "50+",
                    label: "Happy Clients"
                },
                {
                    value: "3+",
                    label: "Years Experience"
                },
                {
                    value: "99%",
                    label: "Success Rate"
                }
            ]
        },
        testimonials: {
            headline: {
                title: "What Our Clients Say",
                description: "Real experiences from clients who have transformed their operations with our drone solutions."
            },
            testimonials: [
                {
                    name: "Rajesh Kumar",
                    rating: 5.0,
                    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
                    role: "Project Manager, Construction Solutions Pvt Ltd",
                    quote: "Using [Company Name]'s drone services for our recent highway project saved us 15% on surveying costs and reduced the project timeline by a week. The accuracy of the drone data was exceptional, minimizing errors and rework."
                },
                {
                    name: "Priya Sharma",
                    rating: 5.0,
                    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
                    role: "Operations Director, AgriTech Solutions",
                    quote: "[Company Name]'s agricultural drone services have significantly improved our crop monitoring and yield prediction.  We've seen a 10% increase in yield efficiency and a 5% reduction in fertilizer usage thanks to the precise data provided by their drones."
                },
                {
                    name: "Amit Patel",
                    rating: 5.0,
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
                    role: "Marketing Head, Property Developers",
                    quote: "The high-resolution aerial photography provided by [Company Name] completely elevated our marketing materials.  Our website traffic increased by 20% after we showcased the stunning drone footage of our new residential complex, leading to a noticeable boost in sales inquiries."
                },
                {
                    name: "Dr. Sunita Verma",
                    rating: 4.0,
                    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
                    role: "Senior Consultant, Environmental Services",
                    quote: "[Company Name]'s drone data acquisition and analysis met all our regulatory compliance requirements for our environmental impact assessment.  The accuracy of their data was impeccable, and their team was very helpful in navigating the complex regulations."
                }
            ],
            stats: [
                {
                    value: "4.9/5",
                    label: "Average Rating"
                },
                {
                    value: "50+",
                    label: "Happy Clients"
                },
                {
                    value: "500+",
                    label: "Projects Delivered"
                },
                {
                    value: "99%",
                    label: "Success Rate"
                }
            ]
        },
        contact: {
            title: "Ready to Elevate Your Project?",
            description: "Get in touch with our drone experts at  for a customized solution that transforms your operations.",
            ctaButton: "Get Free Consultation",
            backgroundImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
            benefits: [
                "Free project consultation and assessment",
                "DGCA compliant operations with certified pilots",
                "24/7 technical support and emergency response",
                "Competitive pricing with transparent cost structure"
            ]
        },
        faq: {
            title: "Frequently Asked Questions",
            questions: [
                {
                    question: "Are your drone operations DGCA compliant?",
                    answer: "Yes, all our drone operations are fully DGCA compliant. We hold valid Remote Pilot Licenses and follow all regulatory requirements for commercial drone operations in India. Our pilots are certified and we maintain comprehensive flight logs and safety protocols."
                },
                {
                    question: "What types of projects do your drones handle?",
                    answer: "Our drones are versatile and can handle a wide range of projects, including aerial photography and videography, land surveying and mapping, infrastructure inspection, construction monitoring, and precision agriculture.  We tailor our services to meet specific client needs."
                },
                {
                    question: "What is your insurance coverage?",
                    answer: "We maintain comprehensive liability insurance to protect against any potential damages or incidents during our drone operations. This ensures that our clients are protected and that we operate with the highest safety standards."
                },
                {
                    question: "How do you ensure data security and privacy?",
                    answer: "Data security and privacy are paramount. We employ robust security measures to protect client data throughout the entire project lifecycle, from data acquisition to storage and delivery.  We comply with all relevant data privacy regulations."
                },
                {
                    question: "What is your pricing structure?",
                    answer: "Our pricing is project-specific and depends on factors such as the scope of work, location, duration, and required deliverables. We provide detailed, transparent quotes after a thorough assessment of your project requirements."
                },
                {
                    question: "What is the process for requesting a quote?",
                    answer: "You can request a quote by contacting us through our website, email, or phone.  Please provide details about your project, including the location, scope of work, and desired deliverables. We will then assess your needs and provide a customized quote."
                }
            ]
        }
    }
})
  const [finaleDataReview, setFinaleDataReview] = useState<any | []>({})

  const navigate = useNavigate();
//pulish final template
  async function fetchAPI() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${AIGenData.userId ||finaleDataReview.userId}/update/${AIGenData.publishedId || finaleDataReview.publishedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalTemplate),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      toast.success("Your site is successfully published and now it is under review");
      navigate("/user/companies");
      setAIGenData({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Something went wrong...");
    }
  }

  //edit and publish final template

  async function editFetchAPI() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${finaleDataReview.userId}/update/${finaleDataReview.publishedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalTemplate),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      toast.success("Your site is successfully published and now it is under review");
      navigate("/user/companies");
      setFinaleDataReview({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Something went wrong...");
    }
  }
  
  function publishTemplate() {
    setIsPublishedTriggered(true);
    // Add a small delay to ensure state updates are processed
    setTimeout(() => {
      fetchAPI();
    }, 100);
  }
  function editPublishTemplate() {
    setIsPublishedTriggered(true);
    // Add a small delay to ensure state updates are processed
    setTimeout(() => {
      editFetchAPI();
    }, 100);
  }


  useEffect(() => {
    console.log("finalData:", finalTemplate);
  }, [finalTemplate]);
  
  useEffect(() => {
    console.log("final preview data:", finaleDataReview);
  }, [finaleDataReview])
  
  return (
    <TemplateContext.Provider value={{ 
      draftDetails, 
      setDraftDetails, 
      AIGenData, 
      setAIGenData, 
      isPublishedTriggered, 
      setIsPublishedTriggered, 
      finalTemplate, 
      setFinalTemplate, 
      publishTemplate,
      setFinaleDataReview,
      finaleDataReview,
      editPublishTemplate 
    }}>
      {children}
    </TemplateContext.Provider>
  );
};

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
}

// Combined Provider for easier app integration
interface CombinedProvidersProps {
  children: ReactNode;
}

export const CombinedProviders: React.FC<CombinedProvidersProps> = ({ children }) => {
  return (
    <UserAuthProvider>
      <TemplateProvider>
        {children}
      </TemplateProvider>
    </UserAuthProvider>
  );
};