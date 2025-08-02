import React from 'react'
import { useAppSelector } from '@/shared/hooks/redux'
import { useDispatch } from 'react-redux'
import { removeAccount } from '../store/nubanSlice'
import { Toast } from '@/shared/components/feedback/Toast'
import { selectNubanState } from '../store/nubanSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card'
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner'
import ConfirmModal from '@/shared/components/ui/ConfirmModal'

export const NubanHistory: React.FC = () => {
  const dispatch = useDispatch()
  const [showToast, setShowToast] = React.useState(false)
  const nubanState = useAppSelector(selectNubanState)
  const accounts = nubanState?.accounts || []
  const isLoading = nubanState?.isLoading || false

  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedAccount, setSelectedAccount] = React.useState<null | typeof accountsArray[0]>(null)

  // Replace with your actual delete logic
  const handleDelete = (account: typeof accountsArray[0]) => {
    setSelectedAccount(account)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      setModalOpen(true)
    }, 2000)
  }

  const confirmDelete = () => {
    if (selectedAccount?.id) {
      dispatch(removeAccount(selectedAccount.id))
    }
    setModalOpen(false)
    setSelectedAccount(null)
  }

  const cancelDelete = () => {
    setModalOpen(false)
    setSelectedAccount(null)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  const accountsArray = Array.isArray(accounts) ? accounts : []
  const accountCount = accountsArray.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated NUBANs ({accountCount})</CardTitle>
      </CardHeader>
      <CardContent>
        {accountCount === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No NUBANs generated yet. Generate your first one above!
          </p>
        ) : (
          <div className="space-y-3">
            {accountsArray.map((account, index) => {
              if (!account || !account.accountNumber) {
                return null
              }

              return (
                <div
                  key={account.id || `account-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-mono text-lg font-semibold">
                      {account.accountNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {account.bankName || 'Unknown Bank'} ({account.bankCode || 'N/A'})
                    </p>
                  </div>
                  <div className="flex flex-col items-end text-right text-sm text-gray-500 gap-2">
                    {account.createdAt ? (
                      <>
                        <p>{new Date(account.createdAt).toLocaleDateString()}</p>
                        <p>{new Date(account.createdAt).toLocaleTimeString()}</p>
                      </>
                    ) : (
                      <p>No date</p>
                    )}
                    <button
                      className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                      onClick={() => handleDelete(account)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
      <ConfirmModal
        open={modalOpen}
        title="Delete NUBAN Account"
        message={`Are you sure you want to delete account ${selectedAccount?.accountNumber}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      {showToast && (
        <Toast type="warning" message="Are you sure you want to delete this account?" onClose={() => setShowToast(false)} />
      )}
    </Card>
  )
}