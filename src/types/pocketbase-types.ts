/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	HabitTracking = "habit_tracking",
	JournalEntries = "journal_entries",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export enum HabitTrackingHabitTypeOptions {
	"building" = "building",
	"breaking" = "breaking",
}
export type HabitTrackingRecord<TcheckInHistory = unknown> = {
	checkInHistory?: null | TcheckInHistory
	habitType: HabitTrackingHabitTypeOptions
	isActive?: boolean
	lastCheckIn?: IsoDateString
	longestStreak?: number
	reminderTime?: string
	startDate: IsoDateString
	streakCount: number
	title: string
	userId: RecordIdString
}

export enum JournalEntriesMoodOptions {
	"amazing" = "amazing",
	"good" = "good",
	"okay" = "okay",
	"bad" = "bad",
	"terrible" = "terrible",
}
export type JournalEntriesRecord = {
	content: HTMLString
	entryDate: IsoDateString
	isFavorite?: boolean
	mood?: JournalEntriesMoodOptions
	tags?: string
	title: string
	userId: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type HabitTrackingResponse<TcheckInHistory = unknown, Texpand = unknown> = Required<HabitTrackingRecord<TcheckInHistory>> & BaseSystemFields<Texpand>
export type JournalEntriesResponse<Texpand = unknown> = Required<JournalEntriesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	habit_tracking: HabitTrackingRecord
	journal_entries: JournalEntriesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	habit_tracking: HabitTrackingResponse
	journal_entries: JournalEntriesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'habit_tracking'): RecordService<HabitTrackingResponse>
	collection(idOrName: 'journal_entries'): RecordService<JournalEntriesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
