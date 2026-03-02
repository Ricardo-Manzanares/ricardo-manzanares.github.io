import React, { useEffect, useState, useRef } from 'react';
import { config, projects, articles } from '../Shared';

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);

  // Text animation states
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const textArray = config.titleWords;
  const period = 2000; // Pause at end of word
  
  // Combine latest projects and articles
  const MAX_CAROUSEL_ITEMS = 5;
  const normalizeItemsByType = (items, type) =>
    items.map(item => ({
      ...item,
      type,
      sortValue: item.date ? new Date(item.date).getTime() : -Infinity,
    }));

  const carouselItems = [
    ...normalizeItemsByType(projects, 'Project'),
    ...normalizeItemsByType(articles, 'Article'),
  ]
    .sort((a, b) => b.sortValue - a.sortValue)
    .slice(0, MAX_CAROUSEL_ITEMS)
    .map(({ sortValue, ...item }) => item);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % textArray.length;
      const fullText = textArray[i];
      
      setDisplayText(isDeleting 
        ? fullText.substring(0, displayText.length - 1) 
        : fullText.substring(0, displayText.length + 1)
      );
      
      setTypingSpeed(isDeleting ? 80 : 150);
      
      if (!isDeleting && displayText === fullText) {
        // Word is complete, wait then start deleting
        setTimeout(() => setIsDeleting(true), period);
      } else if (isDeleting && displayText === '') {
        // Word is deleted, move to next word
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };
    
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, textArray, typingSpeed]);

  // Auto-scroll effect with pause on hover
  useEffect(() => {
    if (isPaused) return; // Don't set interval if paused
    
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => 
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [carouselItems.length, isPaused]);

  // Update scroll position when activeIndex changes
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = activeIndex * (carouselRef.current.offsetWidth / 3);
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Hi, I'm <span className="text-blue-400 inline-block min-w-[180px]">
          {displayText}
        </span>
      </h1>
      <div className="flex space-x-6 mb-12">
        <img 
            src={config.imageProfile}
            alt="Profile" 
            className="h-48 w-48 rounded-full object-cover border-4 border-blue-400" 
        />
      </div>
      <p className="max-w-4xl text-lg md:text-2xl text-gray-300 mb-8">
        I am a web developer specialized in Microsoft Dynamics 365 & Power Platform & Azure products.
      </p>
      <div className="w-full max-w-6xl px-4 mb-12">
        <h2 className="text-2xl font-bold mb-6">Latest <span className="text-blue-400">News</span></h2>        
        {/* Carousel container with mouse events */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel track */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {carouselItems.map((item, index) => (
              <div 
                key={index}
                className={`flex-none w-full sm:w-1/2 md:w-1/3 px-3 snap-start transition-opacity duration-300 
                  ${activeIndex === index 
                    ? 'opacity-100' 
                    : 'opacity-100 sm:opacity-30 md:opacity-30'
                  }
                `}
              >
                {/* Card content remains the same */}
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-400/20 transition-all duration-300 h-full">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold text-white truncate">{item.title}</h3>
                      <span className="text-xs font-semibold bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 line-clamp-2">{item.description || item.summary}</p>
                    <a 
                      href={item.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center"
                    >
                      View {item.type} <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel navigation dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  activeIndex === index ? 'bg-blue-400' : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;