# Validation Rules

- All forms must use Zod schema
- Schema location: src/schemas
- Use zodResolver with react-hook-form

Example:

const form = useForm({
resolver: zodResolver(schema)
})
