import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Chip,
  Box,
  Rating,
} from '@mui/material';
import type { Grievance } from '../types/grievance';

interface GrievanceListProps {
  grievances: Grievance[];
  isAdmin?: boolean;
  onResolve?: (id: string) => void;
}

export const GrievanceList: React.FC<GrievanceListProps> = ({
  grievances,
  isAdmin = false,
  onResolve,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Grievance History
      </Typography>
      <List>
        {grievances.map((grievance) => (
          <ListItem
            key={grievance.id}
            divider
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Rating value={grievance.rating} readOnly />
              <Chip
                label={grievance.status}
                color={grievance.status === 'resolved' ? 'success' : 'warning'}
              />
            </Box>
            <ListItemText
              primary={grievance.complaint}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    Submitted: {new Date(grievance.createdAt).toLocaleString()}
                  </Typography>
                  {grievance.resolvedAt && (
                    <>
                      <br />
                      <Typography component="span" variant="body2" color="text.primary">
                        Resolved: {new Date(grievance.resolvedAt).toLocaleString()}
                      </Typography>
                    </>
                  )}
                  {grievance.resolution && (
                    <>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        Resolution: {grievance.resolution}
                      </Typography>
                    </>
                  )}
                </>
              }
            />
            {isAdmin && grievance.status === 'pending' && onResolve && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label="Resolve"
                  color="primary"
                  onClick={() => onResolve(grievance.id)}
                  clickable
                />
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 