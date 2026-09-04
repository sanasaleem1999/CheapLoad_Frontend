import * as React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { background } from '../../Constants/Colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function QuoteListRow({ data, onEdit, onDelete, onView, onChat }) {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: background,
    padding: theme.spacing(2),
    color: '#1A2027',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '10px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
    marginBottom: theme.spacing(2),
    position: 'relative',
  }));

  const ActionBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    right: theme.spacing(2),
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '140px', // Fixed width for button column
  }));

  const ContentBox = styled(Box)(({ theme }) => ({
    width: 'calc(100% - 140px)', // Leaves space for action buttons
  }));

  const { trailerType, pickupLocation, deliveryLocation, availableDate } = data;

  return (
    <Item>
      {/* Content Section */}
      <ContentBox>
        <Grid container alignItems="center" spacing={2} height={100}>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Trailer
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {trailerType}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Pickup
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {pickupLocation?.city}, {pickupLocation?.stateOrProvince}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Delivery
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {deliveryLocation?.city}, {deliveryLocation?.stateOrProvince}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Available
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {availableDate}
            </Typography>
          </Grid>
        </Grid>
      </ContentBox>

      {/* Fixed Buttons Section */}
      <ActionBox>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={() => onView(data)}
        >
          View
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={() => onChat && onChat(data)}
        >
          Chat
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          startIcon={<EditIcon />}
          onClick={() => onEdit(data)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(data)}
        >
          Delete
        </Button>
      </ActionBox>
    </Item>
  );
}
