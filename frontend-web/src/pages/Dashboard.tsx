import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Person,
  DataObject,
  People,
  TrendingUp,
  Assessment,
  Chat,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <People />,
      color: '#1976d2',
      description: 'Active platform users',
    },
    {
      title: 'Data Entries',
      value: '5,678',
      icon: <DataObject />,
      color: '#388e3c',
      description: 'Total data records',
    },
    {
      title: 'AI Interactions',
      value: '12,345',
      icon: <Chat />,
      color: '#f57c00',
      description: 'AI conversations',
    },
    {
      title: 'Growth Rate',
      value: '+23%',
      icon: <TrendingUp />,
      color: '#d32f2f',
      description: 'Monthly growth',
    },
  ];

  const quickActions = [
    {
      title: 'View Data',
      description: 'Browse and manage data entries',
      icon: <DataObject />,
      action: () => navigate('/data'),
      color: '#1976d2',
    },
    {
      title: 'Manage Users',
      description: 'User management and permissions',
      icon: <People />,
      action: () => navigate('/users'),
      color: '#388e3c',
      adminOnly: true,
    },
    {
      title: 'Analytics',
      description: 'View platform analytics',
      icon: <Assessment />,
      action: () => navigate('/analytics'),
      color: '#f57c00',
    },
    {
      title: 'Profile Settings',
      description: 'Update your profile information',
      icon: <Person />,
      action: () => navigate('/profile'),
      color: '#9c27b0',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's what's happening on your platform today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* User Info Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{user?.username}
                  </Typography>
                  <Chip
                    label={user?.role}
                    size="small"
                    color={user?.role === 'admin' ? 'primary' : 'default'}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Email: {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since: {new Date(user?.createdAt || '').toLocaleDateString()}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/profile')}>
                Edit Profile
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions
                  .filter(action => !action.adminOnly || user?.role === 'admin')
                  .map((action, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={action.icon}
                        onClick={action.action}
                        sx={{
                          height: '100%',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          p: 2,
                          textAlign: 'left',
                          borderColor: action.color,
                          color: action.color,
                          '&:hover': {
                            borderColor: action.color,
                            backgroundColor: `${action.color}10`,
                          },
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
