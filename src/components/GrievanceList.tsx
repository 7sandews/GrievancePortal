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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolveComment, setResolveComment] = useState('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'grievances'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGrievances(
        snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Grievance))
      );
    });
    return unsubscribe;
  }, []);

  const openResolveDialog = (id: string) => {
    setResolvingId(id);
    setResolveComment('');
    setResolveDialogOpen(true);
  };

  const closeResolveDialog = () => {
    setResolvingId(null);
    setResolveComment('');
    setResolveDialogOpen(false);
  };

  const handleResolve = async () => {
    if (!resolvingId) return;
    const grievanceRef = doc(db, 'grievances', resolvingId);
    await updateDoc(grievanceRef, {
      status: 'resolved',
      resolvedAt: serverTimestamp(),
      resolution: resolveComment || 'Issue has been addressed and resolved.',
    });
    closeResolveDialog();
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
                  onClick={() => openResolveDialog(grievance.id)}
                >
                  Resolve
                </Button>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
      <Dialog open={resolveDialogOpen} onClose={closeResolveDialog}>
        <DialogTitle>Resolve Grievance</DialogTitle>
        <DialogContent>
          <TextField
            label="Resolution Comment"
            value={resolveComment}
            onChange={e => setResolveComment(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            autoFocus
            sx={{ mt: 1 }}
            placeholder="Add a comment about the resolution..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResolveDialog}>Cancel</Button>
          <Button onClick={handleResolve} variant="contained" disabled={!resolveComment.trim()}>
            Resolve
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}; 