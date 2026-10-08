import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Field, TextArea, TextInput } from '@/components/ui/Field'
import { listSchema, type ListValues } from '@/lib/schemas'

interface ListFormProps {
  initial?: Partial<ListValues>
  submitLabel: string
  onSubmit: (values: ListValues) => Promise<void> | void
  onCancel: () => void
  error?: string | null
}

export function ListForm({ initial, submitLabel, onSubmit, onCancel, error }: ListFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ListValues>({
    resolver: zodResolver(listSchema),
    defaultValues: { name: initial?.name ?? '', description: initial?.description ?? '' },
  })

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="List name" htmlFor="list-name" error={errors.name?.message}>
        <TextInput
          id="list-name"
          data-autofocus
          placeholder="e.g. Healthy-ish lunches on the Peninsula"
          invalid={Boolean(errors.name)}
          {...register('name')}
        />
      </Field>
      <Field label="Description" htmlFor="list-desc" optional error={errors.description?.message}>
        <TextArea
          id="list-desc"
          className="min-h-20"
          invalid={Boolean(errors.description)}
          {...register('description')}
        />
      </Field>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-danger-bg px-4 py-3 text-small font-medium text-danger"
        >
          {error}
        </p>
      )}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
