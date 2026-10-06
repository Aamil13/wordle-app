import { CustomText } from "@/components/atoms/customText";
import { useAppStore } from "@/store";
import SafeAreaWrapper from "@/utils/SafeAreaWrapper";
import { useTheme } from "@/utils/useTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

type DocumentType = "terms" | "privacy";

export default function LegalDocumentScreen() {
  const router = useRouter();
  const theme = useTheme();
  const currentTheme = useAppStore((state) => state.theme);
  const { type } = useLocalSearchParams<{ type: DocumentType }>();

  const documentType = type || "terms";
  const title = documentType === "terms" ? "Terms of Service" : "Privacy Policy";
  const content = documentType === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT;

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <CustomText size={24} style={styles.title}>
          {title}
        </CustomText>
        <ScrollView style={styles.scrollView}>
          <CustomText size={14} style={styles.content}>
            {content}
          </CustomText>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}

const TERMS_CONTENT = `TERMS OF SERVICE - Guess the Word

Last Updated: October 3, 2026

1. Acceptance of Terms

By downloading, accessing, or using the "Guess the Word" mobile application ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.

These Terms constitute a legally binding agreement between you and Kaos Intent ("we," "us," or "our").

2. Description of Service

Guess the Word is a word puzzle game application that allows users to:
- Play daily word challenges
- Compete in infinite game modes
- Track game statistics and progress
- Create user accounts to save and sync progress
- Compete with other players (if applicable)

3. User Accounts

3.1 Account Registration
- You must be at least 13 years old to create an account
- You must provide accurate and complete information during registration
- You are responsible for maintaining the confidentiality of your account credentials
- You are responsible for all activities that occur under your account

3.2 Account Security
- You agree to notify us immediately of any unauthorized use of your account
- We are not liable for any loss or damage arising from your failure to protect your account
- You may not share your account with others

3.3 Account Termination
- We reserve the right to suspend or terminate your account at our sole discretion
- You may request account deletion at any time through the app settings
- Upon termination, your data will be deleted in accordance with our Privacy Policy

4. Acceptable Use

You agree to use the App only for lawful purposes and in accordance with these Terms. You agree NOT to:

- Use the App for any illegal or unauthorized purpose
- Attempt to gain unauthorized access to the App or its servers
- Interfere with or disrupt the App or servers
- Use automated tools (bots, scrapers) to access the App
- Reverse engineer, decompile, or attempt to extract source code
- Create derivative works based on the App
- Use cheats, hacks, or exploits to gain unfair advantages
- Harass, abuse, or harm other users
- Post offensive, inappropriate, or harmful content

5. Intellectual Property

5.1 App Content
All content in the App, including but not limited to:
- Word puzzles and game mechanics
- User interface design
- Graphics, animations, and visual elements
- Sound effects and music
- Code and software

is owned by Kaos Intent and protected by copyright, trademark, and other intellectual property laws.

5.2 User Content
By using the App, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and display your game statistics and profile information for the purpose of providing the service.

6. Privacy

Your use of the App is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your information.

7. Disclaimers

7.1 "As Is" and "As Available"
The App is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied.

7.2 No Warranties
We disclaim all warranties, including but not limited to:
- Merchantability
- Fitness for a particular purpose
- Non-infringement
- Accuracy, reliability, or availability

7.3 Internet Connection
The App requires an internet connection for certain features. We are not responsible for connectivity issues or interruptions.

8. Limitation of Liability

To the maximum extent permitted by law, Kaos Intent shall not be liable for:
- Any indirect, incidental, special, consequential, or punitive damages
- Loss of profits, data, use, goodwill, or other intangible losses
- Damages resulting from use or inability to use the App
- Damages from unauthorized access to or alteration of your data

Total liability shall not exceed the amount you paid (if any) to use the App.

9. Indemnification

You agree to indemnify and hold harmless Kaos Intent from any claims, damages, or expenses arising from:
- Your use of the App
- Your violation of these Terms
- Your violation of any third-party rights

10. Termination

We reserve the right to:
- Terminate or suspend your access to the App at any time, with or without cause
- Modify or discontinue the App at any time without notice

Upon termination, your right to use the App will immediately cease.

11. Governing Law

These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.

12. Changes to Terms

We reserve the right to modify these Terms at any time. We will notify users of material changes by:
- Posting the updated Terms in the App
- Sending an email notification (if applicable)
- Updating the "Last Updated" date

Continued use of the App after changes constitutes acceptance of the new Terms.

13. Contact Information

If you have questions about these Terms, please contact us:

- Email: support@kaosintent.com
- App Name: Guess the Word
- Developer: Kaos Intent

14. Severability

If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.

15. Entire Agreement

These Terms constitute the entire agreement between you and Kaos Intent regarding the use of the App, superseding any prior agreements.

By using Guess the Word, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

Last Updated: October 3, 2026`;

const PRIVACY_CONTENT = `PRIVACY POLICY - Guess the Word

Last Updated: October 1, 2026

1. Introduction

Welcome to Guess the Word. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our mobile application. By using Guess the Word, you agree to the terms of this Privacy Policy.

2. Information We Collect

2.1 Personal Information
- Email Address: Collected when you create an account or sign in. Used for authentication and account management.
- User Profile Data: Including username, game statistics, and progress data stored on our servers.

2.2 Game Data
- Game Progress: Your word puzzle progress, scores, and achievements are stored locally on your device using SQLite.
- Game Statistics: Including win/loss records, streaks, and performance metrics are synced with our backend servers when you are signed in.

2.3 Technical Data
- Device Information: App version, operating system, and device type for performance optimization and bug fixing.
- Network Information: Internet connectivity status to enable online game modes.

3. How We Use Your Information

We use the collected information for the following purposes:

- Account Management: To create and maintain your user account
- Game Functionality: To save your game progress, sync data across devices, and enable daily challenges
- Authentication: To verify your identity and secure your account
- Improvement: To analyze usage patterns and improve the app's performance and user experience
- Customer Support: To assist you with any issues or questions

4. Data Storage and Security

4.1 Local Storage
- Game progress and settings are stored locally on your device using SQLite database
- Authentication tokens are stored securely using Expo Secure Store
- This data remains on your device and is not shared with third parties

4.2 Server Storage
- User profile data and game statistics are stored on our secure backend servers
- All data is encrypted in transit using HTTPS/TLS
- We implement industry-standard security measures to protect your data

5. Data Sharing

We do NOT sell, rent, or share your personal information with third parties for marketing purposes. We may share data only in the following circumstances:

- Service Providers: With trusted third-party service providers who assist in operating our app (e.g., hosting services, analytics)
- Legal Requirements: When required by law or to protect our rights
- Business Transfer: In the event of a merger, acquisition, or sale of assets

6. Your Rights

You have the following rights regarding your personal data:

- Access: Request a copy of the personal data we hold about you
- Correction: Request correction of inaccurate or incomplete data
- Deletion: Request deletion of your account and associated data
- Data Portability: Request transfer of your data to another service
- Opt-out: You can delete your account at any time through the app's settings

To exercise these rights, please contact us at: support@kaosintent.com

7. Children's Privacy

Guess the Word is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.

8. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

9. Contact Us

If you have any questions about this Privacy Policy or our data practices, please contact us:

- Email: support@kaosintent.com
- App Name: Guess the Word
- Developer: Kaos Intent

10. Third-Party Services

Our app uses the following third-party services:

- Expo SDK: For app development and deployment
- Railway: For backend hosting
- Axios: For API communication

These services have their own privacy policies, and we encourage you to review them.

This Privacy Policy is effective as of October 1, 2026.`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    lineHeight: 22,
  },
});
