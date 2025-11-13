'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

export default function DashboardPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #E9EAEB',
          py: 2,
          px: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/incoxchange-logomark.svg"
            alt="IncoXchange Logo"
            sx={{
              width: 32,
              height: 32,
            }}
          />
          <Typography
            sx={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#181D27',
            }}
          >
            incoXchange
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 4 }}>
        {/* Welcome Message */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: '1.875rem',
              fontWeight: 600,
              color: '#181D27',
              mb: 1,
            }}
          >
            Welcome to your dashboard!
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 400,
              color: '#535862',
            }}
          >
            Your account is now set up and ready to go.
          </Typography>
        </Box>

        {/* Success Message */}
        <Card
          sx={{
            mb: 4,
            backgroundColor: '#eff6ff',
            border: '1px solid #bedcff',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DashboardIcon sx={{ fontSize: 40, color: '#2164ef' }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#181D27',
                    mb: 0.5,
                  }}
                >
                  Onboarding Complete!
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: '#535862',
                  }}
                >
                  You&apos;ve successfully completed all onboarding steps. Your account is now active.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUpIcon sx={{ color: '#2164ef' }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ fontSize: '0.75rem', color: '#717680', mb: 0.5 }}
                    >
                      Total Funding
                    </Typography>
                    <Typography
                      sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#181D27' }}
                    >
                      $0.00
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

          <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ReceiptIcon sx={{ color: '#2164ef' }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ fontSize: '0.75rem', color: '#717680', mb: 0.5 }}
                    >
                      Active Invoices
                    </Typography>
                    <Typography
                      sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#181D27' }}
                    >
                      0
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

          <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PeopleIcon sx={{ color: '#2164ef' }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ fontSize: '0.75rem', color: '#717680', mb: 0.5 }}
                    >
                      Customers
                    </Typography>
                    <Typography
                      sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#181D27' }}
                    >
                      0
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

          <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountBalanceIcon sx={{ color: '#2164ef' }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ fontSize: '0.75rem', color: '#717680', mb: 0.5 }}
                    >
                      Bank Status
                    </Typography>
                    <Typography
                      sx={{ fontSize: '1rem', fontWeight: 600, color: '#10b981' }}
                    >
                      Connected
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
        </Box>

        {/* Coming Soon Message */}
        <Card sx={{ borderRadius: 2, textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#181D27',
                mb: 2,
              }}
            >
              Dashboard Coming Soon
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: '#535862',
                mb: 4,
              }}
            >
              Your full dashboard with analytics, invoice management, and more will be available here.
            </Typography>
            <Button
              variant="contained"
              href="/onboarding"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 2,
                px: 4,
                py: 1,
              }}
            >
              Back to Onboarding
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

