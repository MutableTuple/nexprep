// app/_lib/cron-helpers.js
//
// Shared plumbing for cron routes that need to fan out over every user
// (daily digest, weekly stats, ...). Server-only — uses the service role
// client to bypass RLS, same as the routes that import this.
import { supabaseAdmin } from "./supabase-admin";

export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function listAllUsers() {
  const users = [];
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }
  return users;
}

export async function fetchInChunks(table, column, ids, select) {
  const rows = [];
  for (const idChunk of chunk(ids, 200)) {
    if (idChunk.length === 0) continue;
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(select)
      .in(column, idChunk);
    if (error) throw error;
    rows.push(...(data ?? []));
  }
  return rows;
}
