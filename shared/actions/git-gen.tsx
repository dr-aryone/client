// @flow
// NOTE: This file is GENERATED from json files in actions/json. Run 'yarn build-actions' to regenerate
/* eslint-disable no-unused-vars,prettier/prettier,no-use-before-define,import/no-duplicates */

import * as I from 'immutable'
import * as RPCTypes from '../constants/types/rpc-gen'
import * as RPCTypesGregor from '../constants/types/rpc-gregor-gen'
import * as Types from '../constants/types/git'

// Constants
export const resetStore = 'common:resetStore' // not a part of git but is handled by every reducer. NEVER dispatch this
export const typePrefix = 'git:'
export const badgeAppForGit = 'git:badgeAppForGit'
export const clearBadges = 'git:clearBadges'
export const createPersonalRepo = 'git:createPersonalRepo'
export const createTeamRepo = 'git:createTeamRepo'
export const deletePersonalRepo = 'git:deletePersonalRepo'
export const deleteTeamRepo = 'git:deleteTeamRepo'
export const loadGit = 'git:loadGit'
export const loaded = 'git:loaded'
export const navToGit = 'git:navToGit'
export const navigateToTeamRepo = 'git:navigateToTeamRepo'
export const repoCreated = 'git:repoCreated'
export const repoDeleted = 'git:repoDeleted'
export const setError = 'git:setError'
export const setTeamRepoSettings = 'git:setTeamRepoSettings'

// Payload Types
type _BadgeAppForGitPayload = {readonly ids: Array<string>}
type _ClearBadgesPayload = void
type _CreatePersonalRepoPayload = {readonly name: string}
type _CreateTeamRepoPayload = {readonly name: string; readonly teamname: string; readonly notifyTeam: boolean}
type _DeletePersonalRepoPayload = {readonly name: string}
type _DeleteTeamRepoPayload = {readonly name: string; readonly teamname: string; readonly notifyTeam: boolean}
type _LoadGitPayload = void
type _LoadedPayload = {readonly repos: {'[key: string]': Types.GitInfo}; readonly errors: Array<Error>}
type _NavToGitPayload = {
  readonly switchTab: boolean
  readonly routeState: {expandedSet: I.Set<string>} | null
}
type _NavigateToTeamRepoPayload = {readonly repoID: string; readonly teamname: string}
type _RepoCreatedPayload = void
type _RepoDeletedPayload = void
type _SetErrorPayload = {readonly error: Error | null}
type _SetTeamRepoSettingsPayload = {
  readonly chatDisabled: boolean
  readonly channelName: string | null
  readonly teamname: string
  readonly repoID: string
}

// Action Creators
/**
 * clears badges in the rows
 */
export const createClearBadges = (payload: _ClearBadgesPayload) => ({payload, type: clearBadges})
export const createBadgeAppForGit = (payload: _BadgeAppForGitPayload) => ({payload, type: badgeAppForGit})
export const createCreatePersonalRepo = (payload: _CreatePersonalRepoPayload) => ({
  payload,
  type: createPersonalRepo,
})
export const createCreateTeamRepo = (payload: _CreateTeamRepoPayload) => ({payload, type: createTeamRepo})
export const createDeletePersonalRepo = (payload: _DeletePersonalRepoPayload) => ({
  payload,
  type: deletePersonalRepo,
})
export const createDeleteTeamRepo = (payload: _DeleteTeamRepoPayload) => ({payload, type: deleteTeamRepo})
export const createLoadGit = (payload: _LoadGitPayload) => ({payload, type: loadGit})
export const createLoaded = (payload: _LoadedPayload) => ({payload, type: loaded})
export const createNavToGit = (payload: _NavToGitPayload) => ({payload, type: navToGit})
export const createNavigateToTeamRepo = (payload: _NavigateToTeamRepoPayload) => ({
  payload,
  type: navigateToTeamRepo,
})
export const createRepoCreated = (payload: _RepoCreatedPayload) => ({payload, type: repoCreated})
export const createRepoDeleted = (payload: _RepoDeletedPayload) => ({payload, type: repoDeleted})
export const createSetError = (payload: _SetErrorPayload) => ({payload, type: setError})
export const createSetTeamRepoSettings = (payload: _SetTeamRepoSettingsPayload) => ({
  payload,
  type: setTeamRepoSettings,
})

// Action Payloads
export type BadgeAppForGitPayload = {
  readonly payload: _BadgeAppForGitPayload
  readonly type: 'git:badgeAppForGit'
}
export type ClearBadgesPayload = {readonly payload: _ClearBadgesPayload; readonly type: 'git:clearBadges'}
export type CreatePersonalRepoPayload = {
  readonly payload: _CreatePersonalRepoPayload
  readonly type: 'git:createPersonalRepo'
}
export type CreateTeamRepoPayload = {
  readonly payload: _CreateTeamRepoPayload
  readonly type: 'git:createTeamRepo'
}
export type DeletePersonalRepoPayload = {
  readonly payload: _DeletePersonalRepoPayload
  readonly type: 'git:deletePersonalRepo'
}
export type DeleteTeamRepoPayload = {
  readonly payload: _DeleteTeamRepoPayload
  readonly type: 'git:deleteTeamRepo'
}
export type LoadGitPayload = {readonly payload: _LoadGitPayload; readonly type: 'git:loadGit'}
export type LoadedPayload = {readonly payload: _LoadedPayload; readonly type: 'git:loaded'}
export type NavToGitPayload = {readonly payload: _NavToGitPayload; readonly type: 'git:navToGit'}
export type NavigateToTeamRepoPayload = {
  readonly payload: _NavigateToTeamRepoPayload
  readonly type: 'git:navigateToTeamRepo'
}
export type RepoCreatedPayload = {readonly payload: _RepoCreatedPayload; readonly type: 'git:repoCreated'}
export type RepoDeletedPayload = {readonly payload: _RepoDeletedPayload; readonly type: 'git:repoDeleted'}
export type SetErrorPayload = {readonly payload: _SetErrorPayload; readonly type: 'git:setError'}
export type SetTeamRepoSettingsPayload = {
  readonly payload: _SetTeamRepoSettingsPayload
  readonly type: 'git:setTeamRepoSettings'
}

// All Actions
// prettier-ignore
export type Actions =
  | BadgeAppForGitPayload
  | ClearBadgesPayload
  | CreatePersonalRepoPayload
  | CreateTeamRepoPayload
  | DeletePersonalRepoPayload
  | DeleteTeamRepoPayload
  | LoadGitPayload
  | LoadedPayload
  | NavToGitPayload
  | NavigateToTeamRepoPayload
  | RepoCreatedPayload
  | RepoDeletedPayload
  | SetErrorPayload
  | SetTeamRepoSettingsPayload
  | {type: 'common:resetStore', payload: null}
