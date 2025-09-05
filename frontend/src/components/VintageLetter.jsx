import React, { useRef, useState } from 'react';
import './VintageLetter.css';
import html2pdf from 'html2pdf.js';
const VintageLetter = () => {
  const letterRef=useRef(null)
  const [formData, setFormData] = useState({
    sender: 'Your Name',
    receiver: 'Your Beloved',
    message: 'My Dearest,\n\nAs I sit by candlelight, my thoughts wander to you. Time stands still when we are together, and the world makes sense when you are near.\n\nYours eternally,',
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  });
  const [isEditing, setIsEditing] = useState(false);
   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = async () => {
        const element = letterRef.current;
        const opt = {
          margin: 0,
          filename: `love-letter-to-${formData.receiver}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            windowHeight: element.scrollHeight + 100,
            ignoreElements: (el) => el.classList?.contains('no-print')
          },
          jsPDF: { 
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
          }
        };
        return await html2pdf().set(opt).from(element).output('dataurlstring');
      };
  
      const handleDownloadPDF = async () => {
        setIsGeneratingPDF(true);
        try {
          const pdfDataUrl = await generatePDF();
          const a = document.createElement('a');
          a.href = pdfDataUrl;
          a.download = `love-letter-to-${formData.receiver}.pdf`;
          a.click();
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
    <div className="vintage-app">
      <div className={`vintage-container ${isEditing ? 'with-editor' : ''}`}>
        {/* Vintage Letter View (Left Side) */}
        <div className="vintage-template">
          <div className="vintage-controls">
            <h2>Vintage Love Letter</h2>
            <div className="vintage-button-group">
              <button className="vintage-edit-btn" onClick={toggleEditing}>
                {isEditing ? 'Close ' : 'Edit '}
              </button>
              <button className="vintage-print-btn" onClick={() => window.print()}>
                Print
              </button>
              <button className="vintage-download-btn" onClick={handleDownloadPDF}>
                Download
              </button>
                <button 
          className="whatsapp-btn" 
          onClick={handleShareToWhatsApp}
          disabled={isGeneratingPDF}
        >
      {isGeneratingPDF ? 'Preparing...' : 'Share via WhatsApp'}
    </button>
            </div>
          </div>
          
          <div className="vintage-letter" ref={letterRef}>
            <div className="vintage-header">
              <div className="vintage-receiver">
                <span className="vintage-label">To:</span>
                <div className="vintage-display">{formData.receiver}</div>
              </div>
              <div className="vintage-date">{formData.date}</div>
            </div>

            <div className="vintage-content">
              <div className="quill-ink"></div>
              <div className="vintage-message-display">
                {formData.message.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
              <div className="vintage-divider">✒ ✒ ✒</div>
            </div>

            <div className="vintage-footer">
              <div className="vintage-sender">
                <span className="vintage-label">Your devoted,</span>
                <div className="vintage-display">{formData.sender}</div>
              </div>
              <div className="wax-seal"></div>
            </div>
          </div>
        </div>

        {/* Editor Panel (Right Side - appears when editing) */}
        {isEditing && (
          <div className="vintage-editor-panel">
            <h3>Edit Your Vintage Letter</h3>
            <div className="vintage-form-group">
              <label>Your Name:</label>
              <input
                type="text"
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                placeholder="Enter your name"
                className="vintage-input"
              />
            </div>
            
            <div className="vintage-form-group">
              <label>Recipient:</label>
              <input
                type="text"
                name="receiver"
                value={formData.receiver}
                onChange={handleChange}
                placeholder="Enter recipient's name"
                className="vintage-input"
              />
            </div>
            
            <div className="vintage-form-group">
              <label>Date:</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Enter date"
                className="vintage-input"
              />
            </div>
            
            <div className="vintage-form-group">
              <label>Your Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="10"
                placeholder="Write your love letter here..."
                className="vintage-textarea"
              />
            </div>
            
            <button className="vintage-save-btn" onClick={toggleEditing}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VintageLetter;