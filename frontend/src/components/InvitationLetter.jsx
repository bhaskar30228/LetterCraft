import React, { useRef, useState } from 'react';
import './InvitationLetter.css';
import html2pdf from 'html2pdf.js';

const InvitationLetter = () => {
  const invitationRef = useRef(null);
  const [formData, setFormData] = useState({
    hostName: '',
    eventTitle: '',
    eventType: 'Birthday Party',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    rsvpContact: '',
    rsvpDate: '',
    dressCode: '',
    specialInstructions: '',
    yourClosing: 'We hope to see you there!',
    currentDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = async () => {
    const element = invitationRef.current;
    const clonedElement = element.cloneNode(true);
    clonedElement.style.width = '210mm';
    clonedElement.style.padding = '20mm';
    document.body.appendChild(clonedElement);

    const opt = {
      margin: 1,
      filename: `invitation-${formData.eventTitle || 'event'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 3,
        useCORS: true,
        windowHeight: clonedElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
        ignoreElements: (el) => el.classList?.contains('ei-no-print')
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
      a.download = `Invitation-${formData.eventTitle || 'Event'}.pdf`;
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
      const file = new File([blob], `invitation-${formData.eventTitle}.pdf`, { type: blob.type });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Invitation: ${formData.eventTitle}`,
          text: `You're invited to ${formData.eventTitle}!`,
        });
      } else {
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(`You're invited to ${formData.eventTitle}!`)}`;
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
    <div className="ei-app">
      <div className="ei-controls ei-no-print">
        <h2>Event Invitation</h2>
        <div className="ei-button-group">
          <button className="ei-edit-btn" onClick={toggleEditing}>
            {isEditing ? 'Close' : 'Edit '}
          </button>
          <button className="ei-print-btn" onClick={() => window.print()}>
            Print
          </button>
          <button 
            className="ei-download-btn" 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download '}
          </button>
          <button 
            className="ei-whatsapp-btn" 
            onClick={handleShareToWhatsApp}
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share via WhatsApp'}
          </button>
        </div>
      </div>

      <div className={`ei-container ${isEditing ? 'ei-with-editor' : ''}`}>
        <div className="ei-template" ref={invitationRef}>
          <header className="ei-header">
            <div className="ei-decoration ei-decoration-left"></div>
            <div className="ei-main-title">
              <h1 className="ei-invitation-title">You're Invited!</h1>
              <h2 className="ei-event-title">{formData.eventTitle || 'Event Title'}</h2>
              <p className="ei-hosted-by">Hosted by {formData.hostName || 'Host Name'}</p>
            </div>
            <div className="ei-decoration ei-decoration-right"></div>
          </header>

          <div className="ei-content">
            <div className="ei-date-location">
              <div className="ei-date">
                <i className="fas fa-calendar-alt"></i>
                <span>{formData.eventDate || 'Date'} at {formData.eventTime || 'Time'}</span>
              </div>
              <div className="ei-location">
                <i className="fas fa-map-marker-alt"></i>
                <span>{formData.eventLocation || 'Location'}</span>
              </div>
            </div>
            
            <div className="ei-details">
              <div className="ei-detail-item">
                <h3>Event Type</h3>
                <p>{formData.eventType || 'Event Type'}</p>
              </div>
              
              <div className="ei-detail-item">
                <h3>RSVP By</h3>
                <p>{formData.rsvpDate || 'RSVP Date'}</p>
                <p>Contact: {formData.rsvpContact || 'Contact Info'}</p>
              </div>
              
              {formData.dressCode && (
                <div className="ei-detail-item">
                  <h3>Dress Code</h3>
                  <p>{formData.dressCode}</p>
                </div>
              )}
              
              {formData.specialInstructions && (
                <div className="ei-detail-item">
                  <h3>Special Instructions</h3>
                  <p>{formData.specialInstructions}</p>
                </div>
              )}
            </div>
            
            <div className="ei-closing">
              <p>{formData.yourClosing}</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="ei-editor-panel">
            <h3>Customize Your Invitation</h3>
            <div className="ei-form-grid">
              <div className="ei-form-group">
                <label>Host Name</label>
                <input 
                  type="text" 
                  name="hostName" 
                  value={formData.hostName} 
                  onChange={handleChange} 
                  placeholder="Your Name"
                />
              </div>
              
              <div className="ei-form-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  name="eventTitle" 
                  value={formData.eventTitle} 
                  onChange={handleChange} 
                  placeholder="e.g., Sarah's 30th Birthday"
                />
              </div>
              
              <div className="ei-form-group">
                <label>Event Type</label>
                <select 
                  name="eventType" 
                  value={formData.eventType} 
                  onChange={handleChange}
                >
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Graduation Party">Graduation Party</option>
                  <option value="House Warming">House Warming</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="ei-form-group">
                <label>Event Date</label>
                <input 
                  type="text" 
                  name="eventDate" 
                  value={formData.eventDate} 
                  onChange={handleChange} 
                  placeholder="Saturday, June 10, 2023"
                />
              </div>
              
              <div className="ei-form-group">
                <label>Event Time</label>
                <input 
                  type="text" 
                  name="eventTime" 
                  value={formData.eventTime} 
                  onChange={handleChange} 
                  placeholder="7:00 PM"
                />
              </div>
              
              <div className="ei-form-group">
                <label>Event Location</label>
                <input 
                  type="text" 
                  name="eventLocation" 
                  value={formData.eventLocation} 
                  onChange={handleChange} 
                  placeholder="123 Main St, City"
                />
              </div>
              
              <div className="ei-form-group">
                <label>RSVP Contact</label>
                <input 
                  type="text" 
                  name="rsvpContact" 
                  value={formData.rsvpContact} 
                  onChange={handleChange} 
                  placeholder="Phone or Email"
                />
              </div>
              
              <div className="ei-form-group">
                <label>RSVP By Date</label>
                <input 
                  type="text" 
                  name="rsvpDate" 
                  value={formData.rsvpDate} 
                  onChange={handleChange} 
                  placeholder="June 1, 2023"
                />
              </div>
              
              <div className="ei-form-group">
                <label>Dress Code (Optional)</label>
                <input 
                  type="text" 
                  name="dressCode" 
                  value={formData.dressCode} 
                  onChange={handleChange} 
                  placeholder="e.g., Cocktail Attire"
                />
              </div>
              
              <div className="ei-form-group">
                <label>Special Instructions (Optional)</label>
                <textarea 
                  name="specialInstructions" 
                  value={formData.specialInstructions} 
                  onChange={handleChange} 
                  placeholder="e.g., Bring swimsuit for pool party"
                />
              </div>
              
              <div className="ei-form-group">
                <label>Closing Message</label>
                <input 
                  type="text" 
                  name="yourClosing" 
                  value={formData.yourClosing} 
                  onChange={handleChange} 
                  placeholder="e.g., We hope to see you there!"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationLetter;