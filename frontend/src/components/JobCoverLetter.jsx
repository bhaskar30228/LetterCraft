import React, { useRef, useState } from 'react';
import './JobCoverLetter.css';
import html2pdf from 'html2pdf.js';

const JobCoverLetter = () => {
  const letterRef = useRef(null);
  const [formData, setFormData] = useState({
    yourName: '',
    yourAddress: '',
    yourEmail: '',
    yourPhone: '',
    hiringManager: '',
    companyName: '',
    companyAddress: '',
    currentDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    jobTitle: '',
    companyAchievement: '',
    yourSkills: '',
    yourExperience: '',
    yourEducation: '',
    yourClosing: 'Sincerely,'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
  
      
      const generatePDF = async () => {
  const element = letterRef.current;
  
  // Create a clone of the element to avoid affecting the original
  const clonedElement = element.cloneNode(true);
  clonedElement.style.width = '210mm'; // Standard A4 width
  clonedElement.style.padding = '20mm';
  document.body.appendChild(clonedElement);

  const opt = {
    margin: 1,
    filename: `cover-letter-${formData.yourName || 'application'}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 3, // Increased scale for better quality
      useCORS: true,
      windowHeight: clonedElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      letterRendering: true,
      ignoreElements: (el) => el.classList?.contains('no-print')
    },
    jsPDF: { 
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  try {
    const pdfDataUrl = await html2pdf().set(opt).from(clonedElement).output('dataurlstring');
    return pdfDataUrl;
  } finally {
    document.body.removeChild(clonedElement);
  }
};
  
      const handleDownloadPDF = async () => {
  setIsGeneratingPDF(true);
  try {
    // Add a small delay to ensure DOM updates complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const pdfDataUrl = await generatePDF();
    const a = document.createElement('a');
    a.href = pdfDataUrl;
    a.download = `Cover-Letter-${formData.yourName || 'Application'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    setIsGeneratingPDF(false);
  }
};
  
      const handleShareToWhatsApp = async () => {
      setIsGeneratingPDF(true);
      try {
        const pdfDataUrl = await generatePDF();
        
        // Convert data URL to blob
        const blob = await fetch(pdfDataUrl).then(res => res.blob());
        const file = new File([blob], `love-letter-to-${formData.receiver}.pdf`, { type: blob.type });
        
        // Create shareable link (for mobile devices)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Love Letter to ${formData.receiver}`,
            text: `Here's a love letter for you, ${formData.receiver}!`,
          });
        } else {
          // Fallback for desktop or when Web Share API isn't available
          const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(`Here's a love letter for you, ${formData.receiver}!`)}`;
          window.open(whatsappUrl, '_blank');
          
          // Note: On mobile, you might need to use 'whatsapp://' instead
          // but direct file sharing via URL won't work - user would need to download first
          alert('Please download the PDF first and then share it through WhatsApp');
        }
      } catch (error) {
        console.error('WhatsApp share error:', error);
        alert('Failed to share via WhatsApp. Please try downloading and sharing manually.');
      } finally {
        setIsGeneratingPDF(false);
      }
    };
  
      const toggleEditing = () => {
        setIsEditing(!isEditing);
      };

  return (
    <div className="job-cover-letter-app">
      {/* Controls moved outside the template container */}
      <div className="letter-controls no-print">
        <h2>Professional Cover Letter</h2>
        <div className="button-group">
          <button className="edit-btn" onClick={toggleEditing}>
            {isEditing ? 'Close' : 'Edit '}
          </button>
          <button className="print-btn" onClick={() => window.print()}>
            Print
          </button>
          <button 
            className="download-btn" 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download '}
          </button>
          <button 
            className="whatsapp-btn" 
            onClick={handleShareToWhatsApp}
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share via WhatsApp'}
          </button>
        </div>
      </div>

      <div className={`job-cover-letter-container ${isEditing ? 'with-editor' : ''}`}>
        {/* Cover Letter Template (PDF content only) */}
        <div className="cover-letter-template" ref={letterRef}>
          {/* Letterhead */}
          <header className="letter-header">
            <div className="sender-info">
              <h1 className="your-name">{formData.yourName || 'Your Name'}</h1>
              <p className="contact-info">
                {formData.yourAddress || 'Your Address'} • 
                {formData.yourEmail || ' your@email.com'} • 
                {formData.yourPhone || ' (123) 456-7890'}
              </p>
            </div>
            <div className="logo-placeholder">
              <div className="logo-circle"></div>
            </div>
          </header>

          {/* Letter Content */}
          <div className="letter-content">
            <div className="date">{formData.currentDate}</div>
            
            <div className="recipient-info">
              <p>{formData.hiringManager || 'Hiring Manager Name'}</p>
              <p>{formData.companyName || 'Company Name'}</p>
              <p>{formData.companyAddress || 'Company Address'}</p>
            </div>
            
            <div className="salutation">Dear {formData.hiringManager || 'Hiring Manager'},</div>
            
            <div className="letter-body">
              <p className="opening-paragraph">
                I am excited to apply for the {formData.jobTitle || 'Job Title'} position at {formData.companyName || 'Company Name'}. 
                With my background in {formData.yourSkills || 'relevant skills'}, I am confident in my ability to contribute 
                effectively to your team.
              </p>
              
              <p>
                In my previous role, I {formData.yourExperience || 'achieved significant results'}. 
                I was particularly impressed by {formData.companyAchievement || 'a recent company achievement'}, 
                which demonstrates the innovative spirit I would bring to your organization.
              </p>
              
              <p>
                My education in {formData.yourEducation || 'your field of study'} has provided me with 
                a strong foundation in {formData.yourSkills || 'key skills'}. I'm eager to bring this 
                expertise to your team and help drive {formData.companyName || 'Company Name'}'s continued success.
              </p>
              
              <p className="closing-paragraph">
                Thank you for considering my application. I would welcome the opportunity to discuss 
                how my skills and experiences align with your needs. I'm available at your earliest 
                convenience for an interview.
              </p>
            </div>
            
            <div className="sign-off">
              <p>{formData.yourClosing}</p>
              <div className="signature-line"></div>
              <p className="your-name">{formData.yourName || 'Your Name'}</p>
            </div>
          </div>
        </div>

         {isEditing && (
          <div className="editor-panel">
            <h3>Customize Your Cover Letter</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Your Full Name</label>
                <input 
                  type="text" 
                  name="yourName" 
                  value={formData.yourName} 
                  onChange={handleChange} 
                  placeholder="John Doe"
                />
              </div>
              
              <div className="form-group">
                <label>Your Address</label>
                <input 
                  type="text" 
                  name="yourAddress" 
                  value={formData.yourAddress} 
                  onChange={handleChange} 
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>
              
              <div className="form-group">
                <label>Your Email</label>
                <input 
                  type="email" 
                  name="yourEmail" 
                  value={formData.yourEmail} 
                  onChange={handleChange} 
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="form-group">
                <label>Your Phone</label>
                <input 
                  type="tel" 
                  name="yourPhone" 
                  value={formData.yourPhone} 
                  onChange={handleChange} 
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <div className="form-group">
                <label>Hiring Manager Name</label>
                <input 
                  type="text" 
                  name="hiringManager" 
                  value={formData.hiringManager} 
                  onChange={handleChange} 
                  placeholder="Ms. Jane Smith"
                />
              </div>
              
              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  placeholder="Acme Inc."
                />
              </div>
              
              <div className="form-group">
                <label>Job Title</label>
                <input 
                  type="text" 
                  name="jobTitle" 
                  value={formData.jobTitle} 
                  onChange={handleChange} 
                  placeholder="Software Engineer"
                />
              </div>
              
              <div className="form-group">
                <label>Your Key Skills</label>
                <input 
                  type="text" 
                  name="yourSkills" 
                  value={formData.yourSkills} 
                  onChange={handleChange} 
                  placeholder="Project management, team leadership"
                />
              </div>
              
              <div className="form-group">
                <label>Your Experience</label>
                <textarea 
                  name="yourExperience" 
                  value={formData.yourExperience} 
                  onChange={handleChange} 
                  placeholder="Led a team of 5 developers to deliver a successful product launch"
                />
              </div>
              
              <div className="form-group">
                <label>Company Achievement</label>
                <input 
                  type="text" 
                  name="companyAchievement" 
                  value={formData.companyAchievement} 
                  onChange={handleChange} 
                  placeholder="Your recent innovation in AI technology"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCoverLetter;



