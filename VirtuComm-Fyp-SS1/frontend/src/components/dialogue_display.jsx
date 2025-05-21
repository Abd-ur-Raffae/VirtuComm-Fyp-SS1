import React, { useState, useEffect } from "react";

export const ChatScreen = ({ className }) => {
  const [jsonFile, setJsonData] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseMediaUrl = "http://localhost:8000/api_tts/media/interview/";
  const jsonFileName = "metaDataPatches.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime(); // Cache-busting
        const jsonResponse = await fetch(
          `${baseMediaUrl}${jsonFileName}?t=${timestamp}`
        );
        if (!jsonResponse.ok) throw new Error("Failed to fetch links JSON file");
        const jsonData = await jsonResponse.json();
        setJsonData(jsonData);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`resource-container ${className || ''}`}>
      {loading ? (
        <div className="resource-loading">
          <div className="loading-spinner"></div>
          <p>Loading resources...</p>
        </div>
      ) : jsonFile ? (
        <>
          <div className="resource-section">
            {/* Recommended Videos */}
            <div className="resource-category">Recommended Videos</div>
            <div className="resource-list">
              <ul>
                {jsonFile.recommendation_links?.youtube_links?.map((link, index) => {
                  let videoId = null;
                  let url = link?.url?.trim();

                  if (url.startsWith("//")) {
                    url = "https:" + url;
                  }

                  if (url.includes("duckduckgo.com/l/?uddg=")) {
                    try {
                      const decodedUrl = decodeURIComponent(
                        url.split("uddg=")[1].split("&")[0]
                      );
                      url = decodedUrl;
                    } catch (error) {
                      console.error("Error decoding DuckDuckGo URL:", url, error);
                    }
                  }

                  if (url.includes("watch?v=")) {
                    videoId = new URL(url).searchParams.get("v");
                  } else if (url.includes("youtu.be/")) {
                    videoId = url.split("/").pop().split("?")[0];
                  } else if (url.includes("embed/")) {
                    videoId = url.split("embed/")[1].split(/[?&]/)[0];
                  }

                  const thumbnailUrl = videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : null;

                  return (
                    <li key={index} className="resource-item video-item">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="resource-link">
                        <div
                          className="thumbnail-container"
                          onMouseEnter={() => setHoveredVideo(videoId)}
                          onMouseLeave={() => setHoveredVideo(null)}
                        >
                          {videoId && hoveredVideo === videoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                              className="video-preview"
                              allow="autoplay"
                              title={link.title}
                            />
                          ) : (
                            <img src={thumbnailUrl} alt={link.title} className="thumbnail" />
                          )}
                          <div className="play-overlay">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                              <path fill="currentColor" d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <span className="resource-title">{link.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recommended Sites */}
            <div className="resource-category">Recommended Sites</div>
            <div className="resource-list">
              <ul>
                {jsonFile.recommendation_links?.web_links?.map((link, index) => (
                  <li key={index} className="resource-item">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                      <svg className="link-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                      </svg>
                      <span className="resource-title">{link.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="resource-error">
          <p>First enter the topic name to see related suggestions .</p>
        </div>
      )}
    </div>
  );
};

export const Stu_teach_links = ({ className }) => {
  const [jsonFile, setJsonData] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseMediaUrl = "http://localhost:8000/api_tts/media/stu_teach/";
  const jsonFileName = "metaDataPatches.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime(); // Cache-busting
        const jsonResponse = await fetch(
          `${baseMediaUrl}${jsonFileName}?t=${timestamp}`
        );
        if (!jsonResponse.ok) throw new Error("Failed to fetch links JSON file");
        const jsonData = await jsonResponse.json();
        setJsonData(jsonData);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`resource-container ${className || ''}`}>
      {loading ? (
        <div className="resource-loading">
          <div className="loading-spinner"></div>
          <p>Loading resources...</p>
        </div>
      ) : jsonFile ? (
        <>
          <div className="resource-section">
            {/* Recommended Videos */}
            <div className="resource-category">Recommended Videos</div>
            <div className="resource-list">
              <ul>
                {jsonFile.recommendation_links?.youtube_links?.map((link, index) => {
                  let videoId = null;
                  let url = link?.url?.trim();

                  if (url.startsWith("//")) {
                    url = "https:" + url;
                  }

                  if (url.includes("duckduckgo.com/l/?uddg=")) {
                    try {
                      const decodedUrl = decodeURIComponent(
                        url.split("uddg=")[1].split("&")[0]
                      );
                      url = decodedUrl;
                    } catch (error) {
                      console.error("Error decoding DuckDuckGo URL:", url, error);
                    }
                  }

                  if (url.includes("watch?v=")) {
                    videoId = new URL(url).searchParams.get("v");
                  } else if (url.includes("youtu.be/")) {
                    videoId = url.split("/").pop().split("?")[0];
                  } else if (url.includes("embed/")) {
                    videoId = url.split("embed/")[1].split(/[?&]/)[0];
                  }

                  const thumbnailUrl = videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : null;

                  return (
                    <li key={index} className="resource-item video-item">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="resource-link">
                        <div
                          className="thumbnail-container"
                          onMouseEnter={() => setHoveredVideo(videoId)}
                          onMouseLeave={() => setHoveredVideo(null)}
                        >
                          {videoId && hoveredVideo === videoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                              className="video-preview"
                              allow="autoplay"
                              title={link.title}
                            />
                          ) : (
                            <img src={thumbnailUrl} alt={link.title} className="thumbnail" />
                          )}
                          <div className="play-overlay">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                              <path fill="currentColor" d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <span className="resource-title">{link.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recommended Sites */}
            <div className="resource-category">Recommended Sites</div>
            <div className="resource-list">
              <ul>
                {jsonFile.recommendation_links?.web_links?.map((link, index) => (
                  <li key={index} className="resource-item">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                      <svg className="link-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                      </svg>
                      <span className="resource-title">{link.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="resource-error">
          <p>First enter the topic name to see related suggestions .</p>
        </div>
      )}
    </div>
  );
};

export const Podcast_links = ({ className }) => {
  const [jsonFile, setJsonData] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseMediaUrl = "http://localhost:8000/api_tts/media/podcast/";
  const jsonFileName = "metaDataPatches.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime(); // Cache-busting
        const jsonResponse = await fetch(
          `${baseMediaUrl}${jsonFileName}?t=${timestamp}`
        );
        if (!jsonResponse.ok) throw new Error("Failed to fetch links JSON file");
        const jsonData = await jsonResponse.json();
        setJsonData(jsonData);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`resource-container ${className || ''}`}>
      {loading ? (
        <div className="resource-loading">
          <div className="loading-spinner"></div>
          <p>Loading resources...</p>
        </div>
      ) : jsonFile ? (
        <>
          <div className="resource-section">
            {/* Recommended Videos */}
            <div className="resource-category">Recommended Videos</div>
            <div className="resource-list">
              <ul>
                {jsonFile.recommendation_links?.youtube_links?.map((link, index) => {
                  let videoId = null;
                  let url = link?.url?.trim();

                  if (url.startsWith("//")) {
                    url = "https:" + url;
                  }

                  if (url.includes("duckduckgo.com/l/?uddg=")) {
                    try {
                      const decodedUrl = decodeURIComponent(
                        url.split("uddg=")[1].split("&")[0]
                      );
                      url = decodedUrl;
                    } catch (error) {
                      console.error("Error decoding DuckDuckGo URL:", url, error);
                    }
                  }

                  if (url.includes("watch?v=")) {
                    videoId = new URL(url).searchParams.get("v");
                  } else if (url.includes("youtu.be/")) {
                    videoId = url.split("/").pop().split("?")[0];
                  } else if (url.includes("embed/")) {
                    videoId = url.split("embed/")[1].split(/[?&]/)[0];
                  }

                  const thumbnailUrl = videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : null;

                  return (
                    <li key={index} className="resource-item video-item">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="resource-link">
                        <div
                          className="thumbnail-container"
                          onMouseEnter={() => setHoveredVideo(videoId)}
                          onMouseLeave={() => setHoveredVideo(null)}
                        >
                          {videoId && hoveredVideo === videoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                              className="video-preview"
                              allow="autoplay"
                              title={link.title}
                            />
                          ) : (
                            <img src={thumbnailUrl} alt={link.title} className="thumbnail" />
                          )}
                          <div className="play-overlay">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                              <path fill="currentColor" d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <span className="resource-title">{link.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recommended Sites */}
            <div className="resource-category">Recommended Sites</div>
            <div className="resource-list">
              <ul>
                {jsonFile.recommendation_links?.web_links?.map((link, index) => (
                  <li key={index} className="resource-item">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                      <svg className="link-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                      </svg>
                      <span className="resource-title">{link.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="resource-error">
          <p>First enter the topic name to see related suggestions .</p>
        </div>
      )}

      {/* CSS Styles for Resources */}
      <style jsx>{`
        .resource-container {
          height: 100%;
          width: 100%;
          overflow-y: auto;
          padding: 15px;
          box-sizing: border-box;
        }

        .resource-loading, .resource-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: var(--light-text-secondary);
        }

        .dark-theme .resource-loading, .dark-theme .resource-error {
          color: var(--dark-text-secondary);
        }

        .resource-section {
          margin-bottom: 20px;
        }

        .resource-category {
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--light-border);
          color: var(--light-text-primary);
        }

        .dark-theme .resource-category {
          border-bottom-color: var(--dark-border);
          color: var(--dark-text-primary);
        }

        .resource-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .resource-item {
          margin-bottom: 12px;
          transition: transform 0.2s ease;
        }

        .resource-item:hover {
          transform: translateX(5px);
        }

        .video-item {
          margin-bottom: 20px;
        }

        .resource-link {
          display: flex;
          align-items: center;
          color: var(--light-accent);
          text-decoration: none;
          font-size: 15px;
          line-height: 1.4;
        }

        .dark-theme .resource-link {
          color: var(--dark-accent);
        }

        .resource-link:hover {
          text-decoration: none;
        }

        .resource-title {
          margin-left: 8px;
          word-break: break-word;
        }

        .link-icon {
          flex-shrink: 0;
          margin-right: 4px;
        }

        .thumbnail-container {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          margin-bottom: 8px;
          border-radius: 8px;
          overflow: hidden;
          background-color: #f0f0f0;
        }

        .dark-theme .thumbnail-container {
          background-color: #2a2a2a;
        }

        .thumbnail, .video-preview {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          transition: transform 0.3s ease;
        }

        .thumbnail-container:hover .thumbnail {
          transform: scale(1.05);
        }

        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0.8;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .thumbnail-container:hover .play-overlay {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.1);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .resource-category {
            font-size: 16px;
          }

          .resource-link {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};
