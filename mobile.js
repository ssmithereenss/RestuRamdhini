let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  
  init(paper) {
    // Touch move handling - improved for better response
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      
      if(!this.holdingPaper) return;
      
      if(!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;
        
        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
        
        // Update paper position
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
        
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;
      }
      
      // Handle rotation if needed
      if(e.touches.length > 1) {
        // Simple two-finger rotation
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        const angle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        ) * 180 / Math.PI;
        
        this.rotation = angle;
        this.rotating = true;
      }
      
      // Apply transformation
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }, { passive: false });

    // Touch start - fixed to properly capture initial position
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      
      this.holdingPaper = true;
      
      // Bring paper to front
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    }, { passive: false });
    
    // Touch end - simplified
    paper.addEventListener('touchend', (e) => {
      this.holdingPaper = false;
      this.rotating = false;
    }, { passive: false });
    
    // Handle touch cancel events too
    paper.addEventListener('touchcancel', (e) => {
      this.holdingPaper = false;
      this.rotating = false;
    }, { passive: false });
  }
}

// Document initialization
document.addEventListener('DOMContentLoaded', () => {
  // Prevent default touch actions to avoid conflicts
  document.addEventListener('touchmove', (e) => {
    if(e.target.classList.contains('paper')) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Disable pull-to-refresh and bounce effects in iOS
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  document.body.style.touchAction = 'none';
  
  // Initialize all papers
  const papers = Array.from(document.querySelectorAll('.paper'));
  papers.forEach(paper => {
    // Add touch-specific styles
    paper.style.touchAction = 'none';
    paper.style.webkitTapHighlightColor = 'transparent';
    paper.style.webkitTouchCallout = 'none';
    paper.style.webkitUserSelect = 'none';
    paper.style.userSelect = 'none';
    
    const p = new Paper();
    p.init(paper);
  });
});
