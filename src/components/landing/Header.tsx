import React from 'react'

function Header() {
  return (
    <div className="text-center mb-12 space-y-3">
      {/* Main Heading */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
        Discover Amazing
          Projects
        
      </h1>
      
      {/* Subheading */}
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
       Explore our curated collection of innovative projects
      </p>
      
     
    </div>
  )
}

export default Header