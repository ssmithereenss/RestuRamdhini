let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  
  init(paper) {
    // Add passive: false to ensure Safari handles events properly
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if(!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;
        
        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }
      
      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;
        
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    }, { passive: false }); // Added passive: false for Safari

    paper.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent default to ensure Safari behaves correctly
      if(this.holdingPaper) return;
      
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    }, { passive: false }); // Added passive: false for Safari
    
    paper.addEventListener('touchend', (e) => {
      e.preventDefault(); // Prevent default behavior
      this.holdingPaper = false;
      this.rotating = false;
    }, { passive: false }); // Added passive: false for Safari
    
    // For two-finger rotation on touch screens
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    }, { passive: false }); // Added passive: false
    
    paper.addEventListener('gestureend', (e) => {
      e.preventDefault(); // Prevent default behavior
      this.rotating = false;
    }, { passive: false }); // Added passive: false
  }
}

// Fix for Safari's handling of touch events
document.addEventListener('DOMContentLoaded', () => {
  // Disable default touch actions on body to prevent scrolling
  document.body.style.touchAction = 'none';
  
  // Prevent Safari's elastic scrolling effect
  document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) return; // Allow pinch zoom
    e.preventDefault();
  }, { passive: false });
  
  // Initialize papers
  const papers = Array.from(document.querySelectorAll('.paper'));
  papers.forEach(paper => {
    // Add Safari-specific touch handling styles
    paper.style.webkitTapHighlightColor = 'transparent';
    paper.style.webkitTouchCallout = 'none';
    paper.style.webkitUserSelect = 'none';
    paper.style.userSelect = 'none';
    
    const p = new Paper();
    p.init(paper);
  });
});
