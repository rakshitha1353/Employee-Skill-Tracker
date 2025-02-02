import React, { useState, useEffect } from 'react';
import './style.css'; // Import your CSS file

function App() {
    const [employee, setEmployee] = useState({ name: '', id: '', department: '' });
    const [activities, setActivities] = useState([]);
    const [currentActivity, setCurrentActivity] = useState({ activity: '', date: '', skills: '' });
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Load data from local storage on component mount
        const storedEmployee = JSON.parse(localStorage.getItem('employee'));
        const storedActivities = JSON.parse(localStorage.getItem('activities')) || [];
        if (storedEmployee) setEmployee(storedEmployee);
        setActivities(storedActivities);

    }, []);

    useEffect(() => {
        // Save data to local storage whenever it changes
        localStorage.setItem('employee', JSON.stringify(employee));
        localStorage.setItem('activities', JSON.stringify(activities));
    }, [employee, activities]);

    const handleEmployeeChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleActivityChange = (e) => {
        setCurrentActivity({ ...currentActivity, [e.target.name]: e.target.value });
    };

    const handleSaveEmployee = () => {
        if (employee.name && employee.id && employee.department) {
            alert("Employee information saved.");
        } else {
            alert("Please fill in all employee information.");
        }
    };

    const handleAddActivity = (e) => {
        e.preventDefault();
        if (currentActivity.activity && currentActivity.date && currentActivity.skills) {
            const newActivity = { ...currentActivity };
            setActivities([...activities, newActivity]);
            setCurrentActivity({ activity: '', date: '', skills: '' });
            generateAISuggestions(newActivity.skills);
        } else {
            alert("Please fill in all activity details.");
        }
    };

    const generateAISuggestions = (skills) => {
        const skillsArray = skills.split(',').map(skill => skill.trim().toLowerCase());
        const suggestedSkills = new Set();

        skillsArray.forEach(skill => {
            if (skill === 'javascript') {
                suggestedSkills.add('React');
                suggestedSkills.add('Node.js');
            } else if (skill === 'python') {
                suggestedSkills.add('Data Science');
                suggestedSkills.add('Machine Learning');
            }
        });

        setSuggestions(Array.from(suggestedSkills));
    };

    const generateWeeklyReport = () => {
        return activities.map((activity, index) => (
            <div key={index}> {/* Use index as key for now */}
                <p><strong>Date:</strong> {activity.date}</p>
                <p><strong>Activity:</strong> {activity.activity}</p>
                <p><strong>Skills:</strong> {activity.skills}</p>
                <hr />
            </div>
        ));
    };

    return (
        <div className="container">
            <h1>Employee Skill Tracker</h1>

            <form id="employee-info-form">
                <h2>Employee Information</h2>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={employee.name} onChange={handleEmployeeChange} required />
                <label htmlFor="employeeId">Employee ID:</label>
                <input type="text" id="employeeId" name="id" value={employee.id} onChange={handleEmployeeChange} required />
                <label htmlFor="department">Department:</label>
                <input type="text" id="department" name="department" value={employee.department} onChange={handleEmployeeChange} required />
                <button type="button" onClick={handleSaveEmployee}>Save Information</button>
            </form>

            <form id="activity-form" onSubmit={handleAddActivity}>
                <h2>Log Daily Activity</h2>
                <label htmlFor="activity">Activity:</label>
                <textarea id="activity" name="activity" value={currentActivity.activity} onChange={handleActivityChange} rows="4" required></textarea>
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" value={currentActivity.date} onChange={handleActivityChange} required />
                <label htmlFor="skills">Skills Used (comma-separated):</label>
                <input type="text" id="skills" name="skills" value={currentActivity.skills} onChange={handleActivityChange} required />
                <button type="submit">Log Activity</button>
            </form>

            <h2>Activity Log for {employee.name}</h2>
            <table id="activity-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Activity</th>
                        <th>Skills Used</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.date}</td>
                            <td>{activity.activity}</td>
                            <td>{activity.skills}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div id="ai-suggestions">
                <h2>AI Skill-Up Suggestions</h2>
                <ul id="suggestion-list">
                    {suggestions.length === 0 ? (
                        <li>No specific suggestions at this time. Keep learning!</li>
                    ) : (
                        suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)
                    )}
                </ul>
            </div>

            <div id="weekly-report">
                <h2>Weekly Report</h2>
                {generateWeeklyReport()}
            </div>
        </div>
    );
}

export default App;