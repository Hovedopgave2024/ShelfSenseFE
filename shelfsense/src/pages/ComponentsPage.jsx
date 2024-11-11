import { Container, Typography } from '@mui/material';
import ComponentTable from '../components/components/ComponentsTable';

const ComponentsPage = () => (
    <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
            Our Components
        </Typography>
        <ComponentTable />
    </Container>
);

export default ComponentsPage;
