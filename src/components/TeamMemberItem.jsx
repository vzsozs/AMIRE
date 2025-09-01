// src/components/TeamMemberItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaChevronRight } from 'react-icons/fa';
import './TeamMemberItem.css'; // VÁLTOZÁS

function TeamMemberItem({ person }) { // VÁLTOZÁS
  const { id, name, role } = person;

  return (
    <Link to={`/team/${id}`} className="team-member-item-link"> {/* VÁLTOZÁS */}
      <div className="team-member-item"> {/* VÁLTOZÁS */}
        <FaUserCircle className="team-member-avatar" /> {/* VÁLTOZÁS */}
        <div className="team-member-info"> {/* VÁLTOZÁS */}
          <h3 className="team-member-name">{name}</h3> {/* VÁLTOZÁS */}
          <p className="team-member-role">{role}</p> {/* VÁLTOZÁS */}
        </div>
        <FaChevronRight className="team-member-arrow" /> {/* VÁLTOZÁS */}
      </div>
    </Link>
  );
}

export default TeamMemberItem; // VÁLTOZÁS