const mongoose = require('mongoose');
const crypto = require("crypto");
const rand = require("randomatic");
import { sign } from "../../helpers/jwt";
import { Person } from "../person/model";
const accountTypeEnum = ["paid", "free"];

const UserSchema = new mongoose.Schema({
    role: { type: String, enum: ['superadmin', 'admin', 'cityUser', 'user', 'propertyManager'], default: 'user' },
    email: { type: String, default: '', unique: true },
    hash: { type: String, required: true, select: false },
    salt: { type: String, required: true, select: false },
    tokenHash: { type: String, default: null, unique: true, select: false },
    resetHash: { type: String, default: null, unique: true, select: false },
    profile: {
        children: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Person',
            default: null
        }],
        notificationPreferences: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification',
            default: null
        },
        activities: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity',
            default: null
        }]
    },
    accountType: {
        type: String,
        enum: accountTypeEnum,
        default: 'free'
    },
    removedAt: { type: Date, default: null }
}, { timestamps: true });

/**
 * @param {*} password
 * Takes raw password and hashes it using a generated salt
 * @return {salt}
 * @return {hash}
 */

UserSchema.statics.setPassword = password => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 512, "sha512")
        .toString("hex");
    return {
        salt,
        hash
    };
};

UserSchema.statics.saveProfile = async profile => {
    profile.children.forEach(async child => await Person.create(child));
}

/**
 * @param {*} password
 * @param {*} originalHash
 * @param {*} salt
 * Takes in raw password, hash and salt from requested user and compares to authenticate
 * @returns {Boolean}
 */
UserSchema.methods.validatePassword = function (password, originalHash, salt) {
    const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 512, "sha512")
        .toString("hex");
    return originalHash === hash;
};

/**
 * @param {*} tokenType
 * Takes token type as a string and generates either an access/auth JWT token or a password reset JWT token
 * @returns {token}
 * @returns {refreshToken}
 */
UserSchema.methods.generateTokens = async function (tokenType) {
    try {
        this.tokenHash = rand("Aa0", 32);
        const token = await sign(
            {
                role: this.role,
                id: this._id,
            },
            this.tokenHash,
            "7d"
        );

        const refreshToken = await sign(
            {
                id: this._id,
            },
            this.tokenHash,
            "30d"
        );
        const tokens = await Promise.all([token, refreshToken]);
        this.save();
        return tokens;
    } catch (e) {
        console.error(e, "TOKEN ERROR");
        throw e;
    }
};

export const User = mongoose.model('User', UserSchema);
