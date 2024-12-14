import { z } from "zod";

const MESSAGES = {
  REQUIRED: "必須入力です。",
  INVALID_EMAIL: "メールアドレスの形式が正しくありません",
  INVALID_URL: "URLの形式が正しくありません",
  INVALID_ROLE: "権限は'admin'または'user'のいずれかを選択してください",
  INVALID_BOOLEAN: "アクティブ状態は真偽値である必要があります",
  INVALID_CREATED_AT: "作成日時の形式が正しくありません",
  INVALID_UPDATED_AT: "更新日時の形式が正しくありません",
  MAX_LENGTH: (max: number) => `${max}文字以内で入力してください`,
  MIN_LENGTH: (min: number) => `${min}文字以上で入力してください`,
};

export const userSchema = z.object({
  id: z
    .string()
    .min(1, { message: MESSAGES.REQUIRED })
    .max(50, { message: MESSAGES.MAX_LENGTH(50) }),
  name: z
    .string()
    .min(1, { message: MESSAGES.REQUIRED })
    .max(100, { message: MESSAGES.MAX_LENGTH(100) }),
  email: z
    .string()
    .email({ message: MESSAGES.INVALID_EMAIL })
    .max(100, { message: MESSAGES.MAX_LENGTH(100) }),
  profileImgUrl: z
    .string()
    .url({ message: MESSAGES.INVALID_URL })
    .max(200, { message: MESSAGES.MAX_LENGTH(200) })
    .optional(),
  role: z.enum(["admin", "user"], {
    errorMap: () => ({
      message: MESSAGES.INVALID_ROLE,
    }),
  }),
  isActive: z.boolean({
    required_error: MESSAGES.REQUIRED,
    invalid_type_error: MESSAGES.INVALID_BOOLEAN,
  }),
  password: z
    .string()
    .min(1, { message: MESSAGES.REQUIRED })
    .max(100, { message: MESSAGES.MAX_LENGTH(100) })
    .superRefine((password, ctx) => {
      const minLength = ctx.path.includes("admin") ? 10 : 8;
      if (password.length < minLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: ctx.path.includes("admin")
            ? MESSAGES.MIN_LENGTH(10)
            : MESSAGES.MIN_LENGTH(8),
        });
      }
    }),
  createdAt: z.string({
    invalid_type_error: MESSAGES.INVALID_CREATED_AT,
  }),
  updatedAt: z.string({
    invalid_type_error: MESSAGES.INVALID_UPDATED_AT,
  }),
});
