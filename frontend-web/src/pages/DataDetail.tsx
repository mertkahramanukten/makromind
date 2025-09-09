import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Share,
  Download,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const DataDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const dataItem = {
    id: id || '1',
    title: 'Sample Data Entry 1',
    description: 'This is a detailed description of the sample data entry. It contains comprehensive information about the data structure, purpose, and usage.',
    category: 'General',
    status: 'active',
    content: `This is the main content of the data entry. It can contain various types of information including:

- Structured data
- Text content
- References to other resources
- Metadata and tags

The content can be formatted in different ways depending on the type of data being stored.`,
    tags: ['sample', 'demo', 'test', 'example'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    createdBy: 'John Doe',
    lastModifiedBy: 'Jane Smith',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit data item:', dataItem.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete data item:', dataItem.id);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share data item:', dataItem.id);
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download data item:', dataItem.id);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/data')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {dataItem.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={dataItem.category} size="small" variant="outlined" />
              <Chip
                label={dataItem.status}
                size="small"
                color={getStatusColor(dataItem.status) as any}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleShare} title="Share">
              <Share />
            </IconButton>
            <IconButton onClick={handleDownload} title="Download">
              <Download />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {dataItem.description}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  Content
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {dataItem.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Details
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body1">
                    {dataItem.id}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {dataItem.category}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={dataItem.status}
                    size="small"
                    color={getStatusColor(dataItem.status) as any}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {dataItem.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {new Date(dataItem.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Created By
                  </Typography>
                  <Typography variant="body1">
                    {dataItem.createdBy}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date(dataItem.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Last Modified By
                  </Typography>
                  <Typography variant="body1">
                    {dataItem.lastModifiedBy}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DataDetail;
