import { Box, CircularProgress } from '@mui/material';

export default function Loader() {
  return (
    <Box sx={{ minHeight: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
}
