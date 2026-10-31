import React, { useEffect, useRef } from 'react';
import { projects, scrollAnimationStyles } from '../Shared'

const Projects = () => {
  const projectRefs = useRef([]);
  const sortedProjects = [...projects].sort((a, b) => b.date.localeCompare(a.date));
  
  useEffect(() => {
    // Set up intersection observer to detect when elements come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Stop observing once visible
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of element is visible
    
    // Check which elements are initially visible and observe the rest
    projectRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const isInitiallyVisible = rect.top < window.innerHeight;
        
        if (isInitiallyVisible) {
          ref.classList.add('initial-visible');
        } else {
          observer.observe(ref);
        }
      }
    });
    
    return () => {
      projectRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <style>{scrollAnimationStyles}</style>
      
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
        My <span className="text-blue-400">Projects</span>
      </h2>
      <p className="text-center text-gray-400 mb-12">Here are some of the things I've built.</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {sortedProjects.map((project, index) => (
          <a 
            href={project.link} 
            key={project.title}
            ref={el => projectRefs.current[index] = el}
            target="_blank" 
            rel="noopener noreferrer" 
            className="scroll-animated group block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-400/20 transition-all duration-300 transform hover:-translate-y-1"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-semibold bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Projects;