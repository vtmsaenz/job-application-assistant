// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { projects, loading } = useApp();
  const navigate = useNavigate();

  const stats = React.useMemo(() => {
    const totalApps = projects.reduce((sum, p) => sum + p.applications.length, 0);
    const statusCounts = projects.reduce((acc, project) => {
      project.applications.forEach(app => {
        const status = app.data.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      total: totalApps,
      applied: statusCounts['Applied'] || 0,
      interviewing: statusCounts['Interviewing'] || 0,
      rejected: statusCounts['Rejected'] || 0
    };
  }, [projects]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          className="btn-primary"
          onClick={() => navigate('/projects/new')}
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Briefcase}
          label="Total Applications"
          value={stats.total}
          color="#3b82f6"
        />
        <StatCard
          icon={Clock}
          label="Applied"
          value={stats.applied}
          color="#f59e0b"
        />
        <StatCard
          icon={CheckCircle}
          label="Interviewing"
          value={stats.interviewing}
          color="#10b981"
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={stats.rejected}
          color="#ef4444"
        />
      </div>

      <div className="projects-section">
        <h2>Your Projects</h2>
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects yet. Create your first project to start tracking applications!</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/projects/new')}
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/projects/${project.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card" style={{ borderLeftColor: color }}>
    <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
      <Icon size={24} />
    </div>
    <div className="stat-content">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const ProjectCard = ({ project, onClick }) => (
  <div className="project-card" onClick={onClick}>
    <h3>{project.name}</h3>
    <p className="project-meta">
      {project.applications.length} applications
    </p>
    <p className="project-date">
      Updated {new Date(project.updatedAt).toLocaleDateString()}
    </p>
  </div>
);

export default Dashboard;