import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CountUp from 'react-countup';

export const StatCard = ({ icon, color, label, value }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: `${color}.50`,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      boxShadow: 2,
    }}
  >
    {React.cloneElement(icon, { sx: { fontSize: 60, color: `${color}.700` } })}
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: `${color}.700` }}>
        <CountUp end={value || 0} duration={1.5} separator="," />
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </Box>
);
