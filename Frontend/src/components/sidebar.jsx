import React, { useState } from 'react';
import { 
  IconCalendar, 
  IconHeart, 
  IconFileText, 
  IconStethoscope, 
  IconMenu2 
} from '@tabler/icons-react';
import logoIcon from '../assets/vitalsync_icon.jpg';
import logoFull from '../assets/vitalsync_logo.jpg';

function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);

    const menuItems = [
      { label: 'Appointments', icon: <IconCalendar size={20} /> },
      { label: 'Vitals', icon: <IconHeart size={20} /> },
      { label: 'Records', icon: <IconFileText size={20} /> },
      { label: 'Symptom Checker', icon: <IconStethoscope size={20} /> }
    ];

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
           <div className="sidebar-header">
              <div className="logo-container">
                 {isExpanded ? (
                    <img src={logoFull} alt="VitalSync Logo" className="sidebar-logo full" />
                 ) : (
                    <img src={logoIcon} alt="VitalSync Icon" className="sidebar-logo icon-only" />
                 )}
              </div>
           </div>
              <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)} aria-label="Toggle Sidebar">
                 <IconMenu2 size={22} />
              </button>
           <div className="menu-items">
              {menuItems.map((item, index) => (
                  <button key={index} className="sidebar-btn" title={!isExpanded ? item.label : undefined}>
                     <span className="icon">{item.icon}</span>
                     <span className="label">{item.label}</span>
                  </button>
              ))}
           </div>
        </div>
    );
}

export default Sidebar;