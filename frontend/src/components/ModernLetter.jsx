import React, { useState, useEffect, useRef } from 'react';
import './ModernLetter.css';
import html2pdf from 'html2pdf.js';
import { FaDownload, FaEdit, FaPrint } from 'react-icons/fa';

const ModernLetter = () => {
  const letterRef=useRef(null)
  const [formData, setFormData] = useState({
    sender: 'Your Name',
    receiver: 'Your Beloved',
    message: 'My Love,\n\nIn a world of infinite possibilities, I choose you every time. Your presence is my favorite place to be.\n\nAlways yours,',
    date: new Date().toLocaleDateString()
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
    margin: 10, // Increased margin for better spacing
    filename: `love-letter-to-${formData.receiver}.pdf`,
    image: { type: 'jpeg', quality: 1.25 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      windowHeight: element.scrollHeight,
      ignoreElements: (el) => el.classList?.contains('no-print'),
      letterRendering: true,
      allowTaint: true
    },
    jsPDF: { 
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['css', 'legacy'] }
  };
  
  // Clone the element to adjust its size for PDF
  const clonedElement = element.cloneNode(true);
  clonedElement.style.width = '210mm'; // A4 width
  clonedElement.style.padding = '30mm';
  clonedElement.style.fontSize = '16pt';
  document.body.appendChild(clonedElement);
  
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
    <div className="modern-app">
      <div className={`modern-container ${isEditing ? 'with-editor' : ''}`}>
        {/* Modern Letter View (Left Side) */}
        <div className="modern-template">
          <div className="modern-controls">
            <h2>Modern Love Letter</h2>
            <div className="modern-button-group">
              <button className="modern-edit-btn" onClick={toggleEditing}>
                <FaEdit className="icon" /> {isEditing ? 'Close' : 'Edit'}
              </button>
              <button className="modern-print-btn" onClick={() => window.print()}>
                <FaPrint className="icon" /> Print
              </button>
              <button 
                className="modern-download-btn" 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
              >
                <FaDownload className="icon" /> 
                {isGeneratingPDF ? 'Generating...' : 'Download'}
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
          
          <div className="modern-letter" ref={letterRef}
          style={{ background: 'white' }}>
            <div className="modern-header">
              <div className="modern-receiver">
                <div className="modern-label">For</div>
                <div className="modern-display">{formData.receiver}</div>
              </div>
            </div>

            <div className="modern-content">
              <div className="modern-message-display">
                {formData.message.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="modern-footer">
              <div className="modern-sender">
                <div className="modern-label">With love,</div>
                <div className="modern-display">{formData.sender}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Panel (Right Side - appears when editing) */}
        {isEditing && (
          <div className="modern-editor-panel">
            <h3>Edit Your Modern Letter</h3>
            <div className="modern-form-group">
              <label>Your Name:</label>
              <input
                type="text"
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                placeholder="Enter your name"
                className="modern-input"
              />
            </div>
            
            <div className="modern-form-group">
              <label>Recipient:</label>
              <input
                type="text"
                name="receiver"
                value={formData.receiver}
                onChange={handleChange}
                placeholder="Enter recipient's name"
                className="modern-input"
              />
            </div>
            
            <div className="modern-form-group">
              <label>Your Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="8"
                placeholder="Write your love letter here..."
                className="modern-textarea"
              />
            </div>
            
            <button className="modern-save-btn" onClick={toggleEditing}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernLetter;