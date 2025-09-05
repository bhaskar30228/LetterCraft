import React, { useRef, useState } from 'react';
import './PersonalLetter.css';
import html2pdf from 'html2pdf.js';

const PersonalLetter = () => {
  const letterRef = useRef(null);
  const [formData, setFormData] = useState({
    yourName: '',
    yourAddress: '',
    currentDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    recipientType: 'Mom',
    recipientName: '',
    letterContent: 'I just wanted to take a moment to tell you how much you mean to me...',
    closing: 'With love,'
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
      const clonedElement = element.cloneNode(true);
      clonedElement.style.width = '210mm';
      clonedElement.style.padding = '20mm';
      document.body.appendChild(clonedElement);
  
      const opt = {
        margin: 1,
        filename: `LetterTo-${formData.recipientName || 'application'}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 3,
          useCORS: true,
          windowHeight: clonedElement.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          letterRendering: true,
          ignoreElements: (el) => el.classList?.contains('sa-no-print')
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
        await new Promise(resolve => setTimeout(resolve, 100));
        const pdfDataUrl = await generatePDF();
        const a = document.createElement('a');
        a.href = pdfDataUrl;
        a.download = `Letter-to-${formData.recipientName || 'Application'}.pdf`;
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
        const blob = await fetch(pdfDataUrl).then(res => res.blob());
        const file = new File([blob], `letter-to-${formData.recipientName}.pdf`, { type: blob.type });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `School Application for ${formData.recipientName}`,
            text: `Please find attached the school application letter.`,
          });
        } else {
          const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(`Please find attached the school application letter.`)}`;
          window.open(whatsappUrl, '_blank');
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
    <div className="personal-letter-app">
      <div className="letter-controls no-print">
        <h2>Personal Letter</h2>
        <div className="button-group">
          <button className="edit-btn" onClick={toggleEditing}>
            {isEditing ? 'Close' : 'Edit '}
          </button>
          <button className="download-btn" onClick={handleDownloadPDF}>
            {isGeneratingPDF ? 'Generating...' : 'Download'}
          </button>
           <button 
            className="sa-whatsapp-btn" 
            onClick={handleShareToWhatsApp}
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share via WhatsApp'}
          </button>
        </div>
      </div>

      <div className={`letter-container ${isEditing ? 'with-editor' : ''}`}>
        <div className="letter-template" ref={letterRef}>
          <div className="letter-decoration top-left">❤</div>
          
          <div className="letter-header">
            <div className="sender">
              <p>{formData.yourName || 'Your Name'}</p>
              <p>{formData.yourAddress || 'Your Address'}</p>
              <p className="date">{formData.currentDate}</p>
            </div>
          </div>

          <div className="letter-content">
            <div className="salutation">
              Dear {formData.recipientName || formData.recipientType},
            </div>
            
            <div className="message">
              {formData.letterContent.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            
            <div className="closing">
              <p>{formData.closing}</p>
              <div className="signature">{formData.yourName || 'Your Name'}</div>
            </div>
          </div>
          
          <div className="letter-decoration bottom-right">❤</div>
        </div>

        {isEditing && (
          <div className="editor-panel">
            <h3>Edit Your Letter</h3>
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                name="yourName"
                value={formData.yourName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Your Address:</label>
              <input
                type="text"
                name="yourAddress"
                value={formData.yourAddress}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Recipient Type:</label>
              <select 
                name="recipientType" 
                value={formData.recipientType}
                onChange={handleChange}
              >
                <option value="Mom">Mom</option>
                <option value="Dad">Dad</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Grandma">Grandma</option>
                <option value="Grandpa">Grandpa</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Recipient Name (optional):</label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Leave blank to use type (e.g., 'Mom')"
              />
            </div>
            
            <div className="form-group">
              <label>Your Message:</label>
              <textarea
                name="letterContent"
                value={formData.letterContent}
                onChange={handleChange}
                rows="8"
              />
            </div>
            
            <div className="form-group">
              <label>Closing:</label>
              <input
                type="text"
                name="closing"
                value={formData.closing}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalLetter;