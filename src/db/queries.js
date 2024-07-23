/**
 * Builds a base query for fetching posts.
 * @returns {Object} The base query for posts.
 */
const buildQuery = () => {
  return {
    select: {
      content: true,
      title: true,
      id: true,
      publishedDate: true,
      published: true,
      blogImage: true
    },
    orderBy: [
      {
        publishedDate: 'desc',
      },
    ],
  };
};

/**
 * Builds a search query for posts based on a keyword.
 * @param {string} keyword - The keyword to search for.
 * @returns {Object} The search query for posts.
 */
const buildPostSearchQuery = (keyword) => {
  return {
    select: {
      title: true,
      id: true,
      publishedDate: true,
    },
    orderBy: [
      {
        publishedDate: 'desc',
      },
    ],
    where: {
      OR: [
        {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: keyword,
            mode: 'insensitive',
          },
        }
      ],
    },
    skip: 0,
    take: 5,
  };
};

module.exports = {
  buildQuery,
  buildPostSearchQuery
};
