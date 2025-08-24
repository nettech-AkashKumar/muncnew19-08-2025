import React, { useState, useEffect } from "react";
import axios from "axios";
import EmailMessages from "../EmailMessages/EmailMessages";
import BASE_URL from "../../../../pages/config/config";

const Inbox = () => {
  const [emails, setEmails] = useState([]);

  // useEffect(() => {
  //   const fetchInboxEmails = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.get(`${BASE_URL}/api/email/mail/receive`), {

  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //       },
  //   });

  //       const formatted = res.data.data.map((email) => {
  //         const name = email.name;
  //         const initials = name
  //           .split(" ")
  //           .map((word) => word[0])
  //           .join("")
  //           .toUpperCase()
  //           .slice(0, 2);

  //         return {
  //           ...email,
  //           sender: {
  //             name,
  //             initials,
  //             backgroundColor: "#5e35b1",
  //           },
  //           subject: email.subject,
  //           messagePreview: (email.body || "").slice(0, 50) + "...",
  //           time:
  //             email.createdAt && !isNaN(new Date(email.createdAt))
  //               ? new Intl.DateTimeFormat("en-GB", {
  //                   day: "2-digit",
  //                   month: "short",
  //                   year: "numeric",
  //                   hour: "2-digit",
  //                   minute: "2-digit",
  //                   hour12: true,
  //                 }).format(new Date(email.createdAt))
  //               : "Invalid Date",
  //           status: { dotColor: "red" },
  //           folders: {
  //             galleryCount: email.attachments?.length || 0,
  //           },
  //           tags: {
  //             starred: email.starred,
  //             extraLabelCount: 0,
  //           },
  //         };
  //       });

  //       const inboxOnly = formatted.filter((email) => email.type === "inbox");
  //       setEmails(inboxOnly);
  //     } catch (error) {
  //       console.error("Failed to fetch inbox emails", error);
  //     }
  //   };

  //   fetchInboxEmails();
  //    const interval = setInterval(() => {
  //     fetchInboxEmails();
  //   }, 1000);
  //   return () => clearInterval(interval)
  // }, []);
useEffect(() => {
  const fetchInboxEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/email/mail/receive`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formatted = res.data.data.map((email) => {
        const senderName = email.from?.firstName
            ? `${email.from.firstName} ${email.from.lastName || ''}`.trim()
            : "Unknown";
          const profileImage = email.from?.profileImage?.url || email.from?.profileImage || null;
          const initials = senderName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

        return {
          ...email,
          sender: {
            name: senderName,
            profileImage,
            initials,
            backgroundColor: "#5e35b1",
          },
          subject: email.subject,
          messagePreview: (email.body || "").slice(0, 50) + "...",
          time:
            email.createdAt && !isNaN(new Date(email.createdAt))
              ? new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }).format(new Date(email.createdAt))
              : "Invalid Date",
          status: { dotColor: "red" },
          folders: {
            galleryCount: email.attachments?.length || 0,
          },
          tags: {
            starred: email.starred,
            extraLabelCount: 0,
          },
        };
      });

      const inboxOnly = formatted.filter((email) => email.type === "inbox");
      setEmails(inboxOnly);
    } catch (error) {
      console.error("Failed to fetch inbox emails", error);
    }
  };

  fetchInboxEmails();

  const interval = setInterval(() => {
    fetchInboxEmails();
  }, 1000);

  return () => clearInterval(interval);
}, []);

  const handleToggleStar = async (id, currentStarred) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/api/email/mail/star/${id}`,
        { starred: !currentStarred },
        {
        headers: {
            Authorization: `Bearer ${token}`,
          }, 
      });

      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === id
            ? { ...email, tags: { ...email.tags, starred: !currentStarred } }
            : email
        )
      );
    } catch (error) {
      console.error("Failed to update starred status", error);
    }
  };

  return (
    <EmailMessages
      filteredEmails={emails}
      handleToggleStar={handleToggleStar}
    />
  );
};

export default Inbox;
