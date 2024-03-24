const IgUser = require("./IgUser");

class IgPreviewUser {

    /**
     * 
     * @param {string} id 
     * @param {string} username 
     * @param {string} fullName 
     * @param {string} profilePictureUrl 
     * @param {boolean} isPrivate 
     * @param {boolean} isVerified 
     * @param {boolean} followedByViewer 
     */
    constructor(
        id,
        username,
        fullName,
        profilePictureUrl,
        isPrivate,
        isVerified,
        followedByViewer
    ) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.profilePictureUrl = profilePictureUrl;
        this.isPrivate = isPrivate;
        this.isVerified = isVerified;
        this.followedByViewer = followedByViewer;
    }
}

module.exports = IgPreviewUser;