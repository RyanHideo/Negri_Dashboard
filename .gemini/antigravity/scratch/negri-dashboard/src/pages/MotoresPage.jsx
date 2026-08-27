import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, useTheme } from '@mui/material';
import MotorCard from '../components/MotorCard';
import MotorModal from '../components/MotorModal';
import { glassCardSx } from '../theme';

const MotoresPage = ({ data }) => {
  const theme = useTheme();
  const { motores: motoresData, dashboard: dashboardData } = data;
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [selectedMotor, setSelectedMotor] = useState(null);

  const filteredMotores = motoresData.filter((motor) => {
    const matchStatus = filterStatus === 'Todos' || motor.status === filterStatus.toLowerCase();
    return matchStatus;
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(0, 1fr)',
        gap: { xs: 1, md: 2 },
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        p: { xs: 1, md: 1.5, lg: 2 },
      }}
    >
      {/* Row 1: Summary Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: { xs: 1, md: 2 },
        }}
      >
        <Box sx={{ ...glassCardSx(theme), minWidth: 0, p: { xs: 1, md: 2 }, textAlign: 'center', borderBottom: `4px solid ${theme.palette.success.main}` }}>
          <Typography variant="h4" color="success.main" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' }, lineHeight: 1.15 }}>{dashboardData.motoresLigados}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: { xs: '0.72rem', md: '1rem' }, lineHeight: 1.3 }}>Ligados</Typography>
        </Box>
        <Box sx={{ ...glassCardSx(theme), minWidth: 0, p: { xs: 1, md: 2 }, textAlign: 'center', borderBottom: `4px solid ${theme.palette.text.disabled}` }}>
          <Typography variant="h4" color="text.disabled" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' }, lineHeight: 1.15 }}>{dashboardData.motoresDesligados}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: { xs: '0.72rem', md: '1rem' }, lineHeight: 1.3 }}>Desligados</Typography>
        </Box>
        <Box sx={{ ...glassCardSx(theme), minWidth: 0, p: { xs: 1, md: 2 }, textAlign: 'center', borderBottom: `4px solid ${theme.palette.error.main}` }}>
          <Typography variant="h4" color="error.main" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' }, lineHeight: 1.15 }}>{dashboardData.motoresFalha}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: { xs: '0.72rem', md: '1rem' }, lineHeight: 1.3 }}>Falha</Typography>
        </Box>
      </Box>

      {/* Row 2: Filter Bar */}
      <Box
        sx={{
          ...glassCardSx(theme),
          p: { xs: 1, md: 2 },
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 1, md: 2 },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Ligado">Ligado</MenuItem>
              <MenuItem value="Desligado">Desligado</MenuItem>
              <MenuItem value="Falha">Falha</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
          Mostrando {filteredMotores.length} motores
        </Typography>
      </Box>

      {/* Row 3: Motor Cards Grid */}
      <Box
        sx={{
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          pr: { xs: 0.5, md: 1 }, // scrollbar spacing
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 1, md: 2 },
          }}
        >
          {filteredMotores.map((motor) => (
            <MotorCard
              key={`${motor.ccm}-${motor.id}`}
              motor={motor}
              onClick={(m) => setSelectedMotor(m)}
            />
          ))}
        </Box>
      </Box>

      {selectedMotor && (
        <MotorModal
          motor={selectedMotor}
          open={!!selectedMotor}
          onClose={() => setSelectedMotor(null)}
        />
      )}
    </Box>
  );
};

export default MotoresPage;
