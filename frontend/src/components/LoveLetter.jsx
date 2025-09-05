  import React, { useRef, useState } from 'react';
  import './LoveLetter.css';
  import html2pdf from 'html2pdf.js';

  const LoveLetter = () => {
    const letterRef = useRef(null);
    const [formData, setFormData] = useState({
      sender: 'Your Name',
      receiver: 'Your Beloved',
      message: 'My dearest,\n\nEvery moment with you feels like a beautiful dream I never want to wake up from. Your smile brightens my darkest days, and your love fills my heart with joy beyond measure.\n\nForever yours,',
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
      <div className="love-letter-app">
        <div className={`letter-container ${isEditing ? 'with-editor' : ''}`}>
          <div className="letter-template">
            <div className="letter-controls">
              <h2>Love Letter</h2>
              <div className="button-group">
                <button className="edit-btn" onClick={toggleEditing}>
                  {isEditing ? 'Close' : 'Edit'}
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
          disabled={isGeneratingPDF}
        >
      {isGeneratingPDF ? 'Preparing...' : 'Share via WhatsApp'}
    </button>
              </div>
            </div>
            
          <div className="love-letter" ref={letterRef}>
              <div className="corner-decoration top-left">❤</div>
              <div className="corner-decoration top-right">❤</div>
              <div className="corner-decoration bottom-left">❤</div>
              <div className="corner-decoration bottom-right">❤</div>
              
              <div className="letter-header">
                <div className="receiver">
                  <label>To my beloved</label>
                  <div className="display-field">{formData.receiver}</div>
                </div>
                <div className="date">Date: <span>{formData.date}</span></div>
              </div>

              <div className="letter-content">
                <div className="seal-decoration">✉</div>
                <div className="message-display">
                  {formData.message.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
                <div className="heart-divider">♥ ♥ ♥</div>
              </div>

              <div className="letter-footer">
                <div className="sender">
                  <label>With all my love,</label>
                  <div className="display-field">{formData.sender}</div>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="editor-panel">
              <h3>Edit Your Letter</h3>
              <div className="form-group">
                <label>Your Name:</label>
                <input
                  type="text"
                  name="sender"
                  value={formData.sender}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  />
              </div>
              
              <div className="form-group">
                <label>Recipient:</label>
                <input
                  type="text"
                  name="receiver"
                  value={formData.receiver}
                  onChange={handleChange}
                  placeholder="Enter recipient's name"
                  />
              </div>
              
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="Enter date"
                  />
              </div>
              
              <div className="form-group">
                <label>Your Message:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="10"
                  placeholder="Write your love letter here..."
                  />
              </div>
              
              <button className="save-btn" onClick={toggleEditing}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default LoveLetter;