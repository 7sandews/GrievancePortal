import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { GrievanceForm } from './components/GrievanceForm'
import { GrievanceList } from './components/GrievanceList'
import type { Grievance } from './types/grievance'

function App() {
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')

  const handleSubmit = (newGrievance: Omit<Grievance, 'id' | 'status' | 'createdAt'>) => {
    const grievance: Grievance = {
      ...newGrievance,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setGrievances((prev) => [grievance, ...prev])
  }

  const handleResolve = (id: string) => {
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
              resolution: 'Issue has been addressed and resolved.',
            }
          : g
      )
    )
  }

  const openAdminDialog = () => {
    setAdminDialogOpen(true)
    setAdminPassword('')
    setAdminError('')
  }

  const closeAdminDialog = () => {
    setAdminDialogOpen(false)
    setAdminPassword('')
    setAdminError('')
  }

  const handleAdminLogin = () => {
    if (adminPassword === 'banshuhome') {
      setIsAdmin(true)
      closeAdminDialog()
    } else {
      setAdminError('Incorrect password!')
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
  }

  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Grievance Portal
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Submit Grievance
          </Button>
          <Button color="inherit" component={Link} to="/history">
            View History
          </Button>
          {isAdmin ? (
            <Button color="inherit" onClick={handleAdminLogout} sx={{ ml: 2 }}>
              Exit Admin Mode
            </Button>
          ) : (
            <Button color="inherit" onClick={openAdminDialog} sx={{ ml: 2 }}>
              Admin Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route
            path="/"
            element={<GrievanceForm onSubmit={handleSubmit} />}
          />
          <Route
            path="/history"
            element={
              <GrievanceList
                grievances={grievances}
                isAdmin={isAdmin}
                onResolve={handleResolve}
              />
            }
          />
        </Routes>
      </Container>

      <Dialog open={adminDialogOpen} onClose={closeAdminDialog}>
        <DialogTitle>Admin Login</DialogTitle>
        <DialogContent>
          <TextField
            label="Password"
            type="password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            fullWidth
            autoFocus
            error={!!adminError}
            helperText={adminError}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAdminDialog}>Cancel</Button>
          <Button onClick={handleAdminLogin} variant="contained">Login</Button>
        </DialogActions>
      </Dialog>
    </Router>
  )
}

export default App
