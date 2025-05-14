import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Chip,
  Box,
  Rating,
  Button,
} from '@mui/material';
import type { Grievance } from '../types/grievance';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface GrievanceListProps {
  isAdmin?: boolean;
}

export const GrievanceList: React.FC<GrievanceListProps> = ({
  isAdmin = false,
}) => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'grievances'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGrievances(
        snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Grievance))
      );
    });
    return unsubscribe;
  }, []);

  const handleResolve = async (id: string) => {
    const grievanceRef = doc(db, 'grievances', id);
    await updateDoc(grievanceRef, {
      status: 'resolved',
      resolvedAt: serverTimestamp(),
      resolution: 'Issue has been addressed and resolved.',
    });
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    if (typeof date === 'string') return new Date(date).toLocaleString();
    if (date.seconds) return new Date(date.seconds * 1000).toLocaleString();
    return '';
  };

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
                    Submitted: {formatDate(grievance.createdAt)}
                  </Typography>
                  {grievance.resolvedAt && (
                    <>
                      <br />
                      <Typography component="span" variant="body2" color="text.primary">
                        Resolved: {formatDate(grievance.resolvedAt)}
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
            {isAdmin && grievance.status === 'pending' && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleResolve(grievance.id)}
                >
                  Resolve
                </Button>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 