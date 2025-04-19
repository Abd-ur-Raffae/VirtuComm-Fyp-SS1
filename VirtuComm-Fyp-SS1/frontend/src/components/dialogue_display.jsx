import React, { useState, useEffect } from "react";

export const ChatScreen = () => {
  const [jsonFile, setJsonData] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const baseMediaUrl = "http://localhost:8000/api_tts/media/interview/";
  const jsonFileName = "metaDataPatches.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime(); // Cache-busting
        const jsonResponse = await fetch(
          `${baseMediaUrl}${jsonFileName}?t=${timestamp}`
        );
        if (!jsonResponse.ok) throw new Error("Failed to fetch links JSON file");
        const jsonData = await jsonResponse.json();
        setJsonData(jsonData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.chatContainer}>
      {jsonFile && (
        <>
          <div style={styles.messageContainer}>
            {/* Recommended Videos */}
            <div style={styles.speaker}>Recommended Videos</div>
            <div style={styles.message}>
              <ul style={styles.list}>
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
                    <li key={index} style={styles.listItem}>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                        <div
                          style={styles.thumbnailContainer}
                          onMouseEnter={() => setHoveredVideo(videoId)}
                          onMouseLeave={() => setHoveredVideo(null)}
                        >
                          {videoId && hoveredVideo === videoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                              style={styles.video}
                              allow="autoplay"
                            />
                          ) : (
                            <img src={thumbnailUrl} alt={link.title} style={styles.thumbnail} />
                          )}
                        </div>
                        {link.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recommended Sites */}
            <div style={styles.speaker}>Recommended Sites</div>
            <div style={styles.message}>
              <ul style={styles.list}>
                {jsonFile.recommendation_links?.web_links?.map((link, index) => (
                  <li key={index} style={styles.listItem}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const Stu_teach_links = () => {
  const [jsonFile, setJsonData] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const baseMediaUrl = "http://localhost:8000/api_tts/media/stu_teach/";
  const jsonFileName = "metaDataPatches.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime(); // Cache-busting
        const jsonResponse = await fetch(
          `${baseMediaUrl}${jsonFileName}?t=${timestamp}`
        );
        if (!jsonResponse.ok) throw new Error("Failed to fetch links JSON file");
        const jsonData = await jsonResponse.json();
        setJsonData(jsonData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.chatContainer}>
      {jsonFile && (
        <>
          <div style={styles.messageContainer}>
            {/* Recommended Videos */}
            <div style={styles.speaker}>Recommended Videos</div>
            <div style={styles.message}>
              <ul style={styles.list}>
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
                    <li key={index} style={styles.listItem}>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                        <div
                          style={styles.thumbnailContainer}
                          onMouseEnter={() => setHoveredVideo(videoId)}
                          onMouseLeave={() => setHoveredVideo(null)}
                        >
                          {videoId && hoveredVideo === videoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                              style={styles.video}
                              allow="autoplay"
                            />
                          ) : (
                            <img src={thumbnailUrl} alt={link.title} style={styles.thumbnail} />
                          )}
                        </div>
                        {link.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recommended Sites */}
            <div style={styles.speaker}>Recommended Sites</div>
            <div style={styles.message}>
              <ul style={styles.list}>
                {jsonFile.recommendation_links?.web_links?.map((link, index) => (
                  <li key={index} style={styles.listItem}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const Podcast_links = () => {
  const [jsonFile, setJsonData] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const baseMediaUrl = "http://localhost:8000/api_tts/media/podcast/";
  const jsonFileName = "metaDataPatches.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime(); // Cache-busting
        const jsonResponse = await fetch(
          `${baseMediaUrl}${jsonFileName}?t=${timestamp}`
        );
        if (!jsonResponse.ok) throw new Error("Failed to fetch links JSON file");
        const jsonData = await jsonResponse.json();
        setJsonData(jsonData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.chatContainer}>
      {jsonFile && (
        <>
          <div style={styles.messageContainer}>
            {/* Recommended Videos */}
            <div style={styles.speaker}>Recommended Videos</div>
            <div style={styles.message}>
              <ul style={styles.list}>
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
                    <li key={index} style={styles.listItem}>
                      <a href={url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                        <div
                          style={styles.thumbnailContainer}
                          onMouseEnter={() => setHoveredVideo(videoId)}
                          onMouseLeave={() => setHoveredVideo(null)}
                        >
                          {videoId && hoveredVideo === videoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                              style={styles.video}
                              allow="autoplay"
                            />
                          ) : (
                            <img src={thumbnailUrl} alt={link.title} style={styles.thumbnail} />
                          )}
                        </div>
                        {link.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recommended Sites */}
            <div style={styles.speaker}>Recommended Sites</div>
            <div style={styles.message}>
              <ul style={styles.list}>
                {jsonFile.recommendation_links?.web_links?.map((link, index) => (
                  <li key={index} style={styles.listItem}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  chatContainer: {
    width: "390px",
    height: "430px",
    backdropFilter: "blur(5px)",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    overflowY: "auto",
    borderRadius: "10px",
  },
  list: {
    paddingLeft: "20px",
    margin: "5px 0",
    textAlign: "left",
    listStyleType: "disc",
  },
  listItem: {
    marginBottom: "8px",
    listStylePosition: "outside",
  },
  link: {
    textDecoration: "none",
    color: "#007BFF",
    fontSize: "16px",
    wordBreak: "break-word",
    display: "inline-block",
  },
  thumbnailContainer: {
    width: "310px",
    height: "150px",
    position: "relative",
    marginBottom: "5px",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "5px",
    backgroundColor: "#ccc",
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: "5px",
    border: "none",
  },
  messageContainer: {
    margin: "10px 0",
  },
  speaker: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#555",
  },
  message: {
    maxWidth: "75%",
    padding: "12px",
    borderRadius: "10px",
    margin: "6px",
    fontSize: "16px",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
  },
};
