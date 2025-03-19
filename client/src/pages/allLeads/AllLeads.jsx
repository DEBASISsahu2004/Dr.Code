import React, { useEffect, useState } from 'react';
import './allleads.css';

const AllLeads = () => {
    const [leads, setLeads] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/leads'); // Ensure the correct API URL
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLeads(data);
            } catch (error) {
                console.error('Error fetching leads:', error);
                setError('Failed to fetch leads. Please try again later.');
            }
        };

        fetchLeads();
    }, []);

    const deleteLead = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/leads/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setLeads(leads.filter((lead) => lead._id !== id));
        } catch (error) {
            console.error('Error deleting lead:', error);
            setError('Failed to delete lead. Please try again later.');
        }
    };

    return (
        <div className="table-container">
            <h2>All Leads</h2>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>City</th>
                            <th>Lead Score</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead._id}>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>{lead.phone}</td>
                                <td>{lead.city}</td>
                                <td>{lead.leadScore}</td>
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() => deleteLead(lead._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllLeads;