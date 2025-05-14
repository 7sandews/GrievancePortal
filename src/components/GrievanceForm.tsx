import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import emailjs from 'emailjs-com';
import type { Grievance } from '../types/grievance';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const severityOptions = [
  'Anything with >70% Cocoa would fix this 😈',
  'I need a hug 🫂',
  'I need a long walk 🚶‍♀️',
  'I need to vent 😤',
  'I need a holiday 🏖️',
];

interface GrievanceFormProps {
  onSubmit: (grievance: Omit<Grievance, 'id' | 'status' | 'createdAt'>) => void;
}

export const GrievanceForm: React.FC<GrievanceFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [complaint, setComplaint] = useState('');
  const [rating, setRating] = useState<number | null>(3);
  const [severity, setSeverity] = useState(severityOptions[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (complaint.trim() && rating && title.trim()) {
      onSubmit({
        complaint: `${title.trim()}\n${complaint.trim()}\nSeverity: ${severity}`,
        rating,
      });

      // EmailJS send
      emailjs.send(
        'service_2y6tvrn',
        'template_ag4fmym',
        {
          title,
          complaint,
          rating,
          severity,
        },
        'DlEF2eAs1UUxMVQYP'
      ).then(
        (result) => {
          console.log('Email sent!', result.text);
        },
        (error) => {
          console.error('EmailJS error:', error.text);
        }
      );

      await addDoc(collection(db, 'grievances'), {
        title,
        complaint,
        rating,
        severity,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setComplaint('');
      setRating(3);
      setSeverity(severityOptions[0]);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="sm">
        <Box className="cute-card">
          <Typography className="cute-title" style={{ color: '#e75480' }}>
            Thank you, Aditi 💖
          </Typography>
          <Typography align="center" sx={{ mb: 2 }}>
            Your grievance has been sent to Soumya 💌<br />
            He will get back to you very soon!<br />
            <span style={{ fontSize: '0.95em', color: '#888' }}>(He will think about it)</span>
          </Typography>
          <Button
            className="cute-btn"
            fullWidth
            onClick={() => setSubmitted(false)}
          >
            Submit Another
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box className="cute-card">
        <Typography className="cute-title">
          Submit a Grievance <span role="img" aria-label="wilted rose">🥀</span>
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{ style: { background: '#f8e1ec', borderRadius: 12 } }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="What's bothering you?"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{ style: { background: '#f8e1ec', borderRadius: 12 } }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Mood:</InputLabel>
            <Select
              value={rating}
              label="Mood:"
              onChange={(e) => setRating(Number(e.target.value))}
              sx={{ background: '#f8e1ec', borderRadius: 2 }}
            >
              <MenuItem value={1}>😡</MenuItem>
              <MenuItem value={2}>😠</MenuItem>
              <MenuItem value={3}>😐</MenuItem>
              <MenuItem value={4}>🙂</MenuItem>
              <MenuItem value={5}>😍</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Severity:</InputLabel>
            <Select
              value={severity}
              label="Severity:"
              onChange={(e) => setSeverity(e.target.value)}
              sx={{ background: '#f8e1ec', borderRadius: 2 }}
            >
              {severityOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            className="cute-btn"
            fullWidth
            size="large"
          >
            Submit <span role="img" aria-label="love letter">💌</span>
          </Button>
        </Box>
      </Box>
    </Container>
  );
}; 