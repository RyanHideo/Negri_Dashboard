import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, useTheme } from '@mui/material';
import MotorCard from '../components/MotorCard';
import MotorModal from '../components/MotorModal';
import { glassCardSx } from '../theme';

const MotoresPage = ({ data }) => {
  const theme = useTheme();
  const { motores: motoresData, dashboard: dashboardData } = data;
  const [filterCCM, setFilterCCM] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [selectedMotor, setSelectedMotor] = useState(null);

  const filteredMotores = motoresData.filter((motor) => {
    const matchCCM = filterCCM === 'Todos' || motor.ccm === filterCCM;
    const matchStatus = filterStatus === 'Todos' || motor.status === filterStatus.toLowerCase();
    return matchCCM && matchStatus;
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr',
        gap: 2,
        height: { xs: 'auto', md: '100%' },
        p: { xs: 1, md: 1.5, lg: 2 },
      }}
    >
      {/* Row 1: Summary Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <Box sx={{ ...glassCardSx(theme), p: 2, textAlign: 'center', borderBottom: `4px solid ${theme.palette.success.main}` }}>
          <Typography variant="h4" color="success.main">{dashboardData.motoresLigados}</Typography>
          <Typography variant="subtitle1" color="text.secondary">Ligados</Typography>
        </Box>
        <Box sx={{ ...glassCardSx(theme), p: 2, textAlign: 'center', borderBottom: `4px solid ${theme.palette.text.disabled}` }}>
          <Typography variant="h4" color="text.disabled">{dashboardData.motoresDesligados}</Typography>
          <Typography variant="subtitle1" color="text.secondary">Desligados</Typography>
        </Box>
        <Box sx={{ ...glassCardSx(theme), p: 2, textAlign: 'center', borderBottom: `4px solid ${theme.palette.error.main}` }}>
          <Typography variant="h4" color="error.main">{dashboardData.motoresFalha}</Typography>
          <Typography variant="subtitle1" color="text.secondary">Falha</Typography>
        </Box>
      </Box>

      {/* Row 2: Filter Bar */}
      <Box
        sx={{
          ...glassCardSx(theme),
          p: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="ccm-select-label">CCM</InputLabel>
            <Select
              labelId="ccm-select-label"
              value={filterCCM}
              label="CCM"
              onChange={(e) => setFilterCCM(e.target.value)}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="CCM 1">CCM 1</MenuItem>
              <MenuItem value="CCM 2">CCM 2</MenuItem>
            </Select>
          </FormControl>
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
        <Typography variant="body2" color="text.secondary">
          Mostrando {filteredMotores.length} motores
        </Typography>
      </Box>

      {/* Row 3: Motor Cards Grid */}
      <Box
        sx={{
          overflowY: 'auto',
          pr: 1, // scrollbar spacing
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {filteredMotores.map((motor) => (
            <MotorCard
              key={motor.id}
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
