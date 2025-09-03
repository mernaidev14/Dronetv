import { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, ArrowRight, Star, Users, Building2, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Header Component
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className='h-[40vh] md:h-[60vh] bg-yellow-50 flex items-center justify-center px-4 sm:px-6'>
      <div className='text-center max-w-3xl relative w-full'>
        {/* Geometric Elements */}
        <div className='absolute -top-10 -left-10 w-20 h-20 md:-top-20 md:-left-20 md:w-40 md:h-40 border border-yellow-200 rounded-full opacity-40'></div>
        <div className='absolute -bottom-8 -right-1 w-16 h-16 md:-bottom-16 md:-right-[-5.9rem] md:w-32 md:h-32 bg-yellow-200 opacity-30 rounded-2xl'></div>

        <div className='relative z-10'>
          <div className='flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-8'>
            <div className='w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full'></div>
            <div className='w-4 h-4 md:w-6 md:h-6 border-2 border-amber-400'></div>
            <div className='w-3 h-3 md:w-4 md:h-4 bg-amber-600 rotate-45'></div>
          </div>

          <h1 className='text-3xl md:text-5xl font-light text-amber-900 mb-4 md:mb-6'>
            Companies
            <span className='block text-xl md:text-3xl font-extralight text-yellow-600 mt-1 md:mt-2'>
              Directory
            </span>
          </h1>

          <p className='text-base md:text-lg text-amber-700 mb-6 md:mb-10 max-w-xl mx-auto font-light'>
            Explore top companies leading drone, AI, and geospatial tech.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <button
              onClick={() => navigate('/buildweb')}
              className='bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 md:px-8 md:py-4 font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 rounded-lg w-full sm:w-auto text-sm md:text-base'
            >
              🚀 List Your Company
            </button>
            <div className='w-px h-8 md:h-12 bg-yellow-300 hidden sm:block'></div>
            <button className='text-amber-700 hover:text-amber-900 transition-colors duration-300 text-sm md:text-base sm:mt-0 mt-2'>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Dropdown Filter Component */
const MinimalisticDropdown = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300'
      >
        <span
          className={value === options[0] ? "text-gray-500" : "text-gray-900"}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className='absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-sm z-10'>
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                value === option
                  ? "bg-gray-50 text-gray-900 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* Sidebar Filters Component */
const Sidebar = ({
  searchTerm,
  onSearchChange,
  industryFilter,
  onIndustryChange,
  sortBy,
  onSortChange,
  industries,
  isMobileSidebarOpen,
  onCloseMobileSidebar
}) => {
  const sortOptions = [
    "Sort by Name",
    "Sort by Location",
    "Sort by Date",
    "Sort by Sector",
  ];
  const navigate = useNavigate();

  return (
    <div className={`bg-yellow-50 p-4 md:p-8 h-fit md:sticky md:top-0 border-r border-gray-100 
      ${isMobileSidebarOpen ? 'fixed inset-0 z-50 w-full overflow-y-auto' : 'hidden md:block md:w-80'}`}
    >
      {isMobileSidebarOpen && (
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onCloseMobileSidebar} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className='space-y-6 md:space-y-8'>
        {/* Search Section */}
        <div className='space-y-3'>
          <label className='text-sm font-medium text-gray-900 block'>
            Search
          </label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search companies...'
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-gray-50 transition-colors'
            />
          </div>
        </div>

        {/* Industry Filter */}
        <div className='space-y-3'>
          <label className='text-sm font-medium text-gray-900 block'>
            Sector
          </label>
          <MinimalisticDropdown
            value={industryFilter}
            onChange={onIndustryChange}
            options={industries}
            placeholder='Select sector'
          />
        </div>

        {/* Sort Filter */}
        <div className='space-y-3'>
          <label className='text-sm font-medium text-gray-900 block'>
            Sort by
          </label>
          <MinimalisticDropdown
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            placeholder='Sort options'
          />
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            onSearchChange("");
            onIndustryChange("All Sectors");
            onSortChange("Sort by Name");
          }}
          className='text-sm text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2'
        >
          Clear all filters
        </button>

        {/* Divider */}
        <div className='border-t border-gray-100'></div>

        {/* CTA Section */}
        <div className='space-y-3'>
          <p className='text-sm text-gray-600'>Don't see your company?</p>
          <button 
            onClick={()=>navigate("/buildweb")}
            className='w-full bg-gray-900 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors'
          >
            List Your Company
          </button>
        </div>
      </div>
    </div>
  );
};

// Company Card Component
const CompanyCard = ({ company }) => {
  // Create a placeholder image using company name
  const placeholderImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%23374151' font-size='20' font-family='Arial' font-weight='bold'%3E${
    company.companyName?.charAt(0) || "C"
  }%3C/text%3E%3C/svg%3E`;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className='bg-red-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-l-8 border-gradient-to-b from-pink-500 to-purple-600 group'>
      <div className='p-4 md:p-6 lg:p-8'>
        <div className='flex items-center justify-between mb-4 md:mb-6'>
          <div className='flex items-center gap-3 md:gap-4'>
            <div className='w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden shadow-md bg-white p-1 md:p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-pink-50 group-hover:to-purple-50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110'>
              <img
                src={company.previewImage || placeholderImg}
                alt={`${company.companyName} logo`}
                className='w-full h-full object-contain transition-all duration-500 group-hover:rotate-[-3deg] group-hover:scale-110'
                onError={(e) => {
                  e.target.src = placeholderImg;
                }}
              />
            </div>
            <div className="max-w-[calc(100%-60px)] md:max-w-none">
              <h3 className='text-lg md:text-xl font-bold text-gray-900 line-clamp-2'>
                {company.companyName}
              </h3>
              <div className='flex items-center text-gray-600 mt-1'>
                <MapPin className='w-3 h-3 mr-1' />
                <span className='text-xs md:text-sm'>{company.location}</span>
              </div>
            </div>
          </div>
          <div className='text-right hidden sm:block'>
            <div className='inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium'>
              <Building2 className='w-3 h-3' />
              Published
            </div>
          </div>
        </div>

        {/* Sectors */}
        <div className='mb-4 md:mb-6'>
          <div className='flex flex-wrap gap-1 md:gap-2'>
            {company.sectors.map((sector, index) => (
              <span
                key={index}
                className='px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'
              >
                {sector}
              </span>
            ))}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
          <div className='flex gap-3 md:gap-6'>
            <div className='flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1 md:px-4 md:py-2'>
              <span className='font-bold text-purple-600 text-xs md:text-sm'>
                {formatDate(company.publishedDate)}
              </span>
              <span className='text-xs text-gray-600 hidden md:block'>Published</span>
            </div>
          </div>
          <button className='text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 hover:gap-3 transition-all duration-300 text-sm md:text-base'>
            Learn More
            <ArrowRight className='w-3 h-3 md:w-4 md:h-4' />
          </button>
        </div>

        {/* Published ID (small text at bottom) */}
        <div className='mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100'>
          <div className='flex justify-between items-center text-xs text-gray-400'>
            <span className="truncate mr-2">ID: {company.publishedId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className='flex items-center justify-center py-16'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
    <span className='ml-4 text-gray-600'>Loading companies...</span>
  </div>
);

// Error Component
const ErrorMessage = ({ error, onRetry }) => (
  <div className='text-center py-16'>
    <div className='text-6xl mb-4'>⚠️</div>
    <p className='text-xl text-red-600 mb-2'>Error loading companies</p>
    <p className='text-gray-500 mb-4'>{error}</p>
    <button
      onClick={onRetry}
      className='bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors'
    >
      Try Again
    </button>
  </div>
);

// Main Content Area Component
const MainContent = ({
  companies,
  currentPage,
  totalPages,
  loading,
  error,
  onRetry,
  totalCount,
  hasMore,
  onOpenMobileSidebar
}) => {
  if (loading)
    return (
      <div className='flex-1 bg-yellow-50 px-4 md:px-8 py-8'>
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className='flex-1 bg-yellow-50 px-4 md:px-8 py-8'>
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );

  return (
    <div className='flex-1 bg-yellow-50 px-4 md:px-8 py-8'>
      {/* Mobile filter button */}
      <button 
        onClick={onOpenMobileSidebar}
        className="md:hidden flex items-center gap-2 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
      >
        <Menu className="w-4 h-4" />
        <span>Filters</span>
      </button>

      {/* Results Header */}
      <div className='flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3 md:gap-4'>
        <h2 className='text-xl md:text-2xl font-bold text-black'>
          Companies ({totalCount || companies.length})
        </h2>
        <div className='flex items-center gap-2 md:gap-4'>
          <span className='text-black font-medium text-sm md:text-base'>
            Page {currentPage} of {totalPages}
          </span>
          {hasMore && (
            <span className='text-xs md:text-sm text-gray-600 bg-yellow-100 px-2 py-1 md:px-3 md:py-1 rounded-full'>
              More available
            </span>
          )}
        </div>
      </div>

      {/* Company Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
        {companies.map((company, index) => (
          <div key={company.publishedId || index} className='animate-fadeIn'>
            <CompanyCard company={company} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {companies.length === 0 && !loading && (
        <div className='text-center py-12 md:py-16'>
          <div className='text-6xl mb-4'>🔍</div>
          <p className='text-xl text-gray-700 mb-2'>No companies found</p>
          <p className='text-gray-500 mb-6'>
            Try adjusting your search criteria or clear filters
          </p>
          <button className='bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors'>
            🎯 Be the First - List Your Company
          </button>
        </div>
      )}
    </div>
  );
};

// API Service
const apiService = {
  async fetchCompanies() {
    try {
      const response = await fetch(
        "https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Return the cards array from the response, or use fallback data if API fails
      return {
        cards: data.cards || [],
        totalCount: data.totalCount || 0,
        hasMore: data.hasMore || false,
        nextKey: data.nextKey || null,
      };
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  },
};

// Main Company Directory Component
const CompanyDirectory = () => {
  // State management
  const [companies, setCompanies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Sectors");
  const [sortBy, setSortBy] = useState("Sort by Name");
  const [currentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.fetchCompanies();
      setCompanies(data.cards);
      setTotalCount(data.totalCount);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Get unique sectors from companies
  const industries = [
    "All Sectors",
    ...Array.from(new Set(companies.flatMap((c) => c.sectors))).sort(),
  ];

  // Filter and sort companies
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.sectors.some((sector) =>
        sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSector =
      industryFilter === "All Sectors" ||
      company.sectors.includes(industryFilter);
    return matchesSearch && matchesSector;
  });

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case "Sort by Location":
        return a.location.localeCompare(b.location);
      case "Sort by Date":
        return new Date(b.publishedDate) - new Date(a.publishedDate);
      case "Sort by Sector":
        return a.sectors[0]?.localeCompare(b.sectors[0] || "") || 0;
      default:
        return a.companyName.localeCompare(b.companyName);
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedCompanies.length / 12));

  return (
    <div className='min-h-screen bg-amber-100'>
      <Header />

      {/* Main Layout Container */}
      <div className='flex flex-col md:flex-row bg-gray-50 min-h-screen'>
        {/* Left Sidebar */}
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          industryFilter={industryFilter}
          onIndustryChange={setIndustryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          industries={industries}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <MainContent
          companies={sortedCompanies}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          error={error}
          onRetry={fetchCompanies}
          totalCount={totalCount}
          hasMore={hasMore}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
      </div>
    </div>
  );
};

export default CompanyDirectory;