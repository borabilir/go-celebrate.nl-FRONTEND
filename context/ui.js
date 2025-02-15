/**
 * @fileoverview This file exposes global state items that you can use for UI settings.
 */

import { atom } from 'jotai'

// This is a boolean that controls the visibility of the search prompt from the navbar.
const searchPromoptOpenAtom = atom(false)

export { searchPromoptOpenAtom }
