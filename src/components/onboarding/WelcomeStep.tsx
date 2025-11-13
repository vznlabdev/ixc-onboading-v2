'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        textAlign: 'center',
        px: 4,
        py: 6,
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src="/incoxchange-logomark.svg"
        alt="IncoXchange Logo"
        sx={{
          width: 80,
          height: 80,
          mb: 4,
        }}
      />

      {/* Title */}
      <Typography
        sx={{
          fontSize: '1.875rem',    // 30px
          fontWeight: 600,
          color: '#181D27',
          mb: 3,
          lineHeight: 1.27,
        }}
      >
        Welcome to IncoXchange
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontSize: '1.125rem',    // 18px
          fontWeight: 400,
          color: '#535862',
          mb: 4,
          maxWidth: 600,
          lineHeight: 1.56,
        }}
      >
        Let&apos;s get your business set up to manage invoices,
        customers, and payments.
      </Typography>

      {/* Additional Info */}
      <Typography
        sx={{
          fontSize: '1rem',        // 16px
          fontWeight: 400,
          color: '#535862',
          mb: 6,
          maxWidth: 600,
          lineHeight: 1.5,
        }}
      >
        We&apos;ll guide you through a few quick steps to personalize
        your account and enable funding. It only takes a few
        minutes, you can save and resume anytime.
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={onNext}
          sx={{
            px: 4,
            py: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          Start setup
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={onSkip}
          sx={{
            fontSize: '0.875rem',
            color: '#535862',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          Skip for now
        </Button>
      </Box>
    </Box>
  );
}

